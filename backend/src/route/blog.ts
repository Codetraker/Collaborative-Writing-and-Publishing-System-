import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
import { createPostInput, updatePostInput } from "@thisisfortry/medium-common";

export const blogRouter = new Hono<{
    Bindings: {
		DATABASE_URL: string,
		JWT_SECRETE : string
	},
    Variables : {
        userId : string;
    }
}>();

blogRouter.use('/*', async(c, next)=>{
	//In this middleware
	//get the header
	//verify the header
	//if the header is correct, we need to proceed
	//if not, we tell the user 403
	const header = c.req.header("authorization") || "";
	//authorization = Bearer Token
	// const token = header.split(" ")[1];

	//authorization = token
    try{
        const user = await verify(header, c.env.JWT_SECRETE);
        if(user){
            //@ts-ignore
            c.set('userId', user.id);
            await next();
        }else{
            c.status(403);
            return c.json({
                message : "You are not logged in"
            })
        }
    }catch(e){
        c.status(403);
            return c.json({
            message : "You are not logged in"
        })
    }
        
})

blogRouter.post("/", async (c)=>{
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

    const body = await c.req.json();
    const { success } = createPostInput.safeParse(body);
    if(!success){
		c.status(411);
		return c.json({
			message : "Input not correct"
		});
	}
    const authorId = c.get("userId");

    const post = await prisma.post.create({
        data : {
            title : body.title,
            content : body.content,
            authorId : authorId
        }
    })

    return c.json({
        id : post.id
    });
})

blogRouter.put("/", async (c)=>{
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

    const body = await c.req.json();
    const { success } = updatePostInput.safeParse(body);
    if(!success){
		c.status(411);
		return c.json({
			message : "Input not correct"
		});
	}
    const post = await prisma.post.update({
        where : {
            id : body.id
        },
        data : {
            title : body.title,
            content : body.content,
        }
    })

    return c.json({
        id : post.id
    });
})

blogRouter.get('/bulk', async(c)=>{
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

    const posts = await prisma.post.findMany({
        select : {
            id : true,
            title : true,
            content : true,
            published : true,
            authorId : true,
            author : {
                select : {
                    name : true,
                }
            }
        }
    });

    return c.json({
        posts
    })
})

blogRouter.get("/:id", async (c)=>{
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

    const id = await c.req.param("id");

    try{
        const post = await prisma.post.findFirst({
            where : {
                id : id
            },
            select : {
                id : true,
                title : true,
                content : true,
                published : true,
                authorId : true,
                author : {
                    select : {
                        name : true
                    }
                }
            }
        })
        return c.json({
            post
        });
    }catch(e){
        c.status(411);
        return c.json({
            message : "Error while fatching post"
        });
    }
})

