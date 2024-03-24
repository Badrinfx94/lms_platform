"use client";
import * as z from 'zod';
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form'
import { useState } from 'react';
import { Chapter, Course } from '@prisma/client';

import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormMessage
} from "@/components/ui/form"
import { Input } from '@/components/ui/input';
import {Button} from '@/components/ui/button'
import { Pencil, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { ChapterList } from './chapter-list';

interface ChaptersFormProps{
    initialData:Course & {chapters:Chapter[]}
    courseId:string
}

const formSchema=z.object({
   title:z.string().min(1),

})

const ChaptersForm = ({
    initialData,
    courseId
}:ChaptersFormProps) => {
    const router =useRouter()

    const [isCreating, setIsCreating]=useState(false)
    const [isUpdating,setIsUpdating]=useState(false)
    
    const toggleCreating =()=>
    {
    setIsCreating((current)=>!current);
    }
    
    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            title: ''},
    })

    const {isSubmitting,isValid}=form.formState

    const onSubmit=async(values:z.infer<typeof formSchema>)=>{
       try{ 
            await axios.post(`/api/courses/${courseId}/chapters`,values)
            toast.success("Chapter Created")
            toggleCreating()
            router.refresh()
       }catch(error){
        console.log(error)
        toast.error("Something went wrong")
       }
    }
    const onReorder = async (updateData: { id: string; position: number }[]) => {
        try {
            // console.log("updatedata",updateData)
          setIsUpdating(true);
    
          await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
            list: updateData
          });
          toast.success("Chapters reordered");
          router.refresh();
        } catch(error) {
            console.log(error)
          toast.error("Something went wrong");
        } finally {
          setIsUpdating(false);
        }
      }
    
      const onEdit = (id: string) => {
        router.push(`/teacher/courses/${courseId}/chapters/${id}`);
      }

    return (  
       <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className='font-medium flex items-center justify-between'>
                Chapter title
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating? (
                        <>Cancel</>
                    )
                    :(
                        <>
                        <PlusCircle className='h-4 w-4 mr-2'/>
                            Add a Chapter
                        </>
                   )}
                </Button>
            </div>

            {isCreating && (
                <Form {...form}>
                    <form
                    onSubmit={form.handleSubmit(onSubmit)} 
                    className='space-y-4 mt-4'
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field})=>(
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='e.g. Course Introduction'
                                            {...field}
                                        ></Input>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        >
                        </FormField>
                       
                            <Button
                            disabled={!isValid || isSubmitting} 
                            type="submit"
                            >
                                Create
                            </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.chapters.length && "text-slate-500 italic"
                )}>
                  {!initialData.chapters.length && "No Chapters"}   
                  {/* Todo : add a list of chapters */}
                  <ChapterList
                    onEdit={onEdit}
                    onReorder={onReorder}
                    items={initialData.chapters || []}
                  />
                </div>
            )}
            {!isCreating && (
                <p className='text-xs text-muted-foreground mt-4'>
                    Drag and drop to reorder the chapters
                </p>
            )}
       </div>
    );
}
 
export default ChaptersForm;