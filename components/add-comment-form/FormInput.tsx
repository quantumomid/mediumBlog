import React from "react";
import { UseFormRegister } from "react-hook-form";
import { IFormInput } from "../../pages/post/[slug]";

interface FormInputProps {
    name: "name" | "email" | "_id" | "comment";
    placeholder: string;
    isTextArea?: boolean;
    register: UseFormRegister<IFormInput>
}

const FormInput:React.FC<FormInputProps> = ({ register, placeholder, name, isTextArea }) => {

    if(isTextArea) {
        return (
            <label className="block mb-5" htmlFor="name">
                <span className="text-gray-700 capitalize">{name}</span>
                <textarea
                    id={name} 
                    className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring"                         
                    placeholder={placeholder}
                    rows={8} 
                    {...register(name, { required: true })}
                />
            </label>
        )
    }

    return (
        <label className="block mb-5" htmlFor="name">
            <span className="text-gray-700 capitalize">{name}</span>
            <input 
                id={name} 
                className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"                         
                placeholder={placeholder}
                type="text" 
                {...register(name, { required: true })}
            />
        </label>
    )
}

export default FormInput;