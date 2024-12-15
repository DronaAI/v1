"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import axios from "axios"
import { z } from "zod"
import { Plus, Trash, Zap } from 'lucide-react'
import { createChaptersSchema } from "@/validators/course"
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useToast } from "./ui/use-toast"
import { Progress } from "./ui/progress"
import { useSession } from "next-auth/react"

type Props = { isPro: boolean }

type Input = z.infer<typeof createChaptersSchema>

const CreateCourseForm = ({ isPro }: Props) => {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session } = useSession()
  const [loading, setLoading] = React.useState(false)
  const { mutate: createChapters, isLoading } = useMutation({
    mutationFn: async ({ title, units }: Input) => {
      const response = await axios.post("/api/course/createChapters", {
        title,
        units,
      })
      return response.data
    },
  })

  const form = useForm<Input>({
    resolver: zodResolver(createChaptersSchema),
    defaultValues: {
      title: "",
      units: ["", "", ""],
    },
  })

  function onSubmit(data: Input) {
    if (data.units.some((unit) => unit === "")) {
      toast({
        title: "Error",
        description: "Please fill all the units",
        variant: "destructive",
      })
      return
    }
    createChapters(data, {
      onSuccess: ({ course_id }) => {
        toast({
          title: "Success",
          description: "Course created successfully",
        })
        router.push(`/create/${course_id}`)
      },
      onError: (error) => {
        console.error(error)
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        })
      },
    })
  }

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const response = await axios.get("/api/stripe")
      window.location.href = response.data.url
    } catch (error) {
      console.log("error", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-white/60">Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the main topic of the course"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12 focus-visible:ring-1 focus-visible:ring-purple-400/50 focus-visible:border-purple-400/50"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <AnimatePresence>
            {form.watch("units").map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <FormField
                  control={form.control}
                  name={`units.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-white/60">
                        Unit {index + 1}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter subtopic of the course"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12 focus-visible:ring-1 focus-visible:ring-purple-400/50 focus-visible:border-purple-400/50"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => form.setValue("units", [...form.watch("units"), ""])}
              variant="outline"
              className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Unit
            </Button>
            <Button
              type="button"
              onClick={() => form.setValue("units", form.watch("units").slice(0, -1))}
              variant="outline"
              className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
            >
              <Trash className="h-4 w-4 mr-2" />
              Remove Unit
            </Button>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-[#0a0b1e] hover:bg-white/90 h-12 text-base font-medium"
          >
            Let&apos;s Go!
          </Button>
        </form>
      </Form>

      {!isPro && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 rounded-xl bg-[#1a1b2e] p-6 space-y-4"
        >
          <div className="flex justify-between text-sm text-white/80 mb-1">
            <span>{session?.user.credits || 0} / 10 Free Generations</span>
          </div>
          <Progress 
            value={session?.user.credits ? (session.user.credits / 10) * 100 : 0} 
            className="bg-white/10 h-2"
          >
            <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-full rounded-full" />
          </Progress>
        </motion.div>
      )}
    </motion.div>
  )
}

export default CreateCourseForm

