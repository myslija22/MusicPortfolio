import { useState } from "react"
import { Button, Field, Flex, Heading, Input, Stack } from "@chakra-ui/react"
import { PasswordInput } from "@/components/ui/password-input"
import { useForm } from "react-hook-form"
import { supabase } from "@/lib/supabase"
import { useLocation, useNavigate } from "react-router-dom"
import { toaster } from "@/components/ui/toaster"

interface FormValues {
    email: string
    password: string
}

export default function Register() {
    const [isLoading, setIsLoading] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()

    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from?.pathname || "/"

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true)

        const { error, data: authData } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
        })

        if (error) {
            toaster.create({
                title: "Signup Failed",
                description: error.message,
                type: "error",
            })
        } else {
            console.log("Signed up successfully!", authData)
            toaster.create({
                title: "Signed up successfully!",
                description: "Please check your email to confirm your account.",
                type: "success",
            })
            setTimeout(() => {
                navigate(from, { replace: true })
            }, 3000)
        }

        setIsLoading(false)
    })

    return (
        <Flex 
            align="center" 
            justify="center"
            p="4"
            direction="column"
        >
            <Heading>Register</Heading>
            <form onSubmit={onSubmit} style={{ width: "100%", maxWidth: "400px" }}>
                <Stack gap="4" align="stretch">
                    
                    <Field.Root invalid={!!errors.email}>
                        <Field.Label>E-mail</Field.Label>
                        <Input 
                        {...register("email", { required: "Email is required" })} 
                        type="email" 
                        />
                        <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.password}>
                        <Field.Label>Password</Field.Label>
                        <PasswordInput 
                        {...register("password", { required: "Password is required" })} 
                        />
                        <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                    </Field.Root>

                    <Button type="submit" loading={isLoading} disabled={isLoading} width="full">
                        {isLoading ? "Signing up..." : "Submit"}
                    </Button>
                </Stack>
            </form>
        </Flex>
        
    )
}