import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

export interface BlogInterface{
        "id": string,
        "title": string,
        "content": string,
        "published": boolean,
        "authorId": string,
        "author": {
            "name": string
        }
}


export const useBlog = ({id} : {id:string}) => {
        const [loading, setLoading] = useState(true);
        const [blog, setBlog] = useState<BlogInterface>();

        useEffect(()=>{
            axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
                headers : {
                    Authorization : localStorage.getItem("token")
                }
            })
                .then(response => {
                    setBlog(response.data.post);
                    setLoading(false);
                })
        },[id])
        return {
            loading,
            blog
    }
}

export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<BlogInterface[]>([]);

    useEffect(()=>{
        //As here we can't use async await inside useEffect so we have to use .then
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
            headers : {
                Authorization : localStorage.getItem("token")
            }
        })
            .then(response => {
                setBlogs(response.data.posts);
                setLoading(false);
            })
    },[])
    return {
        loading,
        blogs
    }
}