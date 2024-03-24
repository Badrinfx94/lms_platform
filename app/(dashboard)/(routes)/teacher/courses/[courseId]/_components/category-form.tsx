"use client";
import * as z from 'zod';
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod';
import {useForm,useFieldArray} from 'react-hook-form'
import { useState } from 'react';
import { Course } from '@prisma/client';

import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input';
import {Button} from '@/components/ui/button'
import { Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import  ComboBox from '@/components/ui/combobox';




interface CategoryFormProps{
    initialData:Course
    courseId:string;
    options:{label:string, value:string;}[]
}

const formSchema=z.object({
    categoryId:z.string().min(1)
})

const CategoryForm = ({
    initialData,
    courseId,
    options
}:CategoryFormProps) => {
    const router =useRouter()
    const [isEditing,setisEditing]=useState(false)
    const toggleEdit =()=>setisEditing((current)=>!current);
    // const [selectedOption,setSelectedOption]=useState({label:null,value:null})
    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{categoryId:initialData?.categoryId || ''},
    })
    
    const {isSubmitting,isValid}=form.formState

    const onSubmit=async(values:z.infer<typeof formSchema>)=>{
       try{ 
            await axios.patch(`/api/courses/${courseId}`,values)
            toast.success("Course Updated")
            toggleEdit()
            router.refresh()
       }catch{
        toast.error("Something went wrong")
       }
    }
    const selectedOption=options.find((option)=> option.value===initialData.categoryId)
    return (  
       <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className='font-medium flex items-cener justify-between'>
                Course Category
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    )
                    :(
                        <>
                        <Pencil className='h-4 w-4 mr-2'/>
                        Edit Category
                        </>
                   )}
                </Button>
            </div>
            {
                !isEditing && (
                    <p className={cn("text-sm mt-2",
                        !initialData.categoryId && "text-slate-500 italic"
                    )}>
                        {selectedOption?.label|| "No Category"}
                    </p>
                )
            }
            {isEditing && (
                <Form {...form}>
                    <form
                    onSubmit={form.handleSubmit(onSubmit)} 
                    className='space-y-4 mt-4'
                    >
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({field})=>(
                                <FormItem>
                                    <FormControl>
                                        <>
                                            <ComboBox
                                                options={options}
                                                setValue={function(value:any){
                                                    form.setValue("categoryId",value.value, { shouldValidate: true})
                                                }}
                                                defaultLabel={selectedOption?.label ?  selectedOption?.label : ""}
                                            />
                                        </>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <div className='flex items-center gap-x-2'>
                            <Button
                            disabled={!isValid || isSubmitting} 
                            type="submit"
                            >
                                Save
                            </Button>

                        </div>
                    </form>
                </Form>
            )}
       </div>
    );
}
 
export default CategoryForm;