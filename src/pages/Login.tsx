import { useState } from "react"
import { Alert, Button, Field, Input, Stack, Flex, Heading } from "@chakra-ui/react"
import { PasswordInput } from "@/components/ui/password-input"
import { Toaster, toaster } from "@/components/ui/toaster"
import { useForm } from "react-hook-form"
import { supabase } from "@/lib/supabase"
import { useLocation, useNavigate } from "react-router-dom"


interface FormValues {
  email: string
  password: string
}

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()

  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || "/"


  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true)
    setAuthError(null)

    const { error, data: authData } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setAuthError(error.message)
      toaster.create({
        title: "Login Failed",
        description: error.message,
        type: "error",
    });
    } else {
      console.log("Logged in successfully!", authData)
      toaster.create({
        title: "Login Successful",
        description: "You have been logged in successfully.",
        type: "success",
      });
      navigate(from, { replace: true })

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
      <Heading>Login</Heading>
      <form onSubmit={onSubmit} style={{ width: "100%", maxWidth: "400px" }}>
        <Stack gap="4" align="stretch"> 
          {authError && (
            <Alert.Root status="error" variant="subtle">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Authentication Failed</Alert.Title>
                <Alert.Description>{authError}</Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}
          
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
            {isLoading ? "Signing in..." : "Submit"}
          </Button>
        </Stack>
      </form>
    </Flex>
  )
}