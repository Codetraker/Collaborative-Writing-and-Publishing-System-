import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useBlogs } from "../hooks"

export const Blogs = () => {
    const {loading, blogs} = useBlogs();

    if(loading){
        return <div>
            <div>
                <Appbar />
            </div>
            <div className="flex justify-center">
                <div>
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                </div>
            </div>
        </div>
    }
    return (
        <div>
            <Appbar />
            <div className="flex justify-center">
                <div>
                    {blogs.map(blog => <BlogCard 
                        id = {blog.id}
                        authorName={blog.author.name || "Anonymous"} 
                        title={blog.title} 
                        content={blog.content} 
                        publishDate="Dec 3, 2023"/>)}
                </div>
            </div>
        </div>
        
    )
}