import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signinInput, signupInput } from "@thisisfortry/medium-common";

export const userRouter = new Hono<{
    Bindings: {
		DATABASE_URL: string,
		JWT_SECRETE : string
	}
}>();

userRouter.post('/signup', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const { success } = signupInput.safeParse(body);
	if(!success){
		c.status(411);
		return c.json({
			message : "Input not correct"
		});
	}
 	try {
		const user = await prisma.user.create({
			data: {
				email: body.email,
				password: body.password,
				name : body.name
			}
		});
		const jwt = await sign({ id: user.id }, c.env.JWT_SECRETE);
		return c.json({ jwt });
	} catch(e) {
		c.status(403);
		return c.json({ error: "error while signing up" });
	}
})


userRouter.post('/signin', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const { success } = signinInput.safeParse(body);
	if(!success){
		c.status(411);
		return c.json({
			message : "Input not correct"
		});
	}
	try{
		const user = await prisma.user.findUnique({
			where: {
				email: body.email
			}
		});
	
		if (!user) {
			c.status(403);
			return c.json({ error: "user not found" });
		}
	
		const jwt = await sign({ id: user.id }, c.env.JWT_SECRETE);
		return c.json({ jwt });
	}catch(e){
		c.status(403);
		return c.json({ error: "error while signing up" });
	}
	
})