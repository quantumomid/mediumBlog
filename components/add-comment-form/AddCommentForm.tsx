import { SubmitHandler, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { IFormInput } from "../../pages/post/[slug]";
import { Post } from "../../typings";
import ErrorMessages from "./ErrorMessages";
import FormInput from "./FormInput";

interface AddCommentFormProps {
    post: Post;
    register: UseFormRegister<IFormInput>;
    errors: any;
    onSubmit: SubmitHandler<IFormInput>;
    handleSubmit: UseFormHandleSubmit<IFormInput>;
}

const AddCommentForm:React.FC<AddCommentFormProps> = ({ handleSubmit, onSubmit, post, register, errors }) => (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-5 max-w-2xl mx-auto mb-10">
        <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
        <h4 className="text-3xl font-bold">Leave a comment below!</h4>
        <hr className="py-3 mt-2" />

        {/* Hidden dummy input to register/connect to react hooks form */}
        <input 
            {...register("_id")}
            type="hidden"
            name="_id"
            value={post._id}
        />
        <FormInput name="name" register={register} placeholder="Omid Wakili" />
        <FormInput name="email" register={register} placeholder="omid@hotmail.com" />
        <FormInput name="comment" register={register} placeholder="Great points!" isTextArea />

        <ErrorMessages errors={errors} />

        <input 
            type="submit" 
            className="shadow bg-yellow-500 hover:bg-yellow-400 cursor-pointer focus:shadow-outline focus-outline-none text-white font-bold py-2 px-4 rounded" 
        />
    </form>
);

export default AddCommentForm;