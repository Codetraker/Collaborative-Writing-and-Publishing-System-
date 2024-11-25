import axios from "axios";
import { Appbar } from "../components/Appbar"
import { BACKEND_URL } from "../config";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Publish = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();
    return (
        <div>
            <Appbar />
            <div className="flex justify-center">
                <div className="max-w-screen-lg w-full pt-8">
                    <div>
                        <input onChange={(e)=>{
                            setTitle(e.target.value)
                        }} type="text" className="focus:outline-none block p-2.5 w-full text-m text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-200" placeholder="Wrie your title..." required></input>
                    </div>
                    <div className="pt-8">
                        <TextEditor onChange={(e)=>{
                            setDescription(e.target.value)
                        }}/>
                    </div>
                    <div>
                        <button onClick={async()=>{
                            const response = await axios.post(`${BACKEND_URL}/api/v1/blog`,{
                                title,
                                content : description
                            },{
                                headers : {
                                    Authorization :localStorage.getItem("token")
                                }
                            })
                            navigate(`/blog/${response.data.id}`)
                        }} type="submit" className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-green-700 rounded-lg focus:ring-4 focus:ring-green-200">
                            Publish post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TextEditor({onChange} : {onChange : (e:ChangeEvent<HTMLTextAreaElement>) => void}){
    return ( 
    <div>
        <div>
            <div className="w-full mb-4 border rounded-lg bg-gray-50">
                <div className="bg-white rounded-b-lg ">
                    <textarea onChange={onChange} id="editor" rows={12} className="focus:outline-none block w-full px-0 text-sm text-gray-800 bg-white border-0 px-4 py-2 " placeholder="Write an article..." required ></textarea>
                </div>
            </div>
        </div>
    </div>

    );
}