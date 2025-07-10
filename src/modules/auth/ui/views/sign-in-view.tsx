"use client";

import { z } from "zod"
import { OctagonAlert } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {FaGithub , FaGoogle} from "react-icons/fa"


//This is the format of form
const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, { message: "Password is Required" })
})

export const SignInView = () => {

    
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    });

    {/*Below is the function which is responsible for truly logging in the user  */ }
    const onSubmit = async (data: z.infer<typeof formSchema>) => { //data provided to onsubmit is of type formSchema which has already been declared using zod , thus data would be email  and a pass of min 1 length , This we know for sure
        setError(null);
        setPending(true);

        authClient.signIn.email(
            {
                email: data.email,
                password: data.password,
                callbackURL : "/"
            }, {
            onSuccess: () => {
                setPending(false);
                router.push('/')
                
            },
            onError: ({ error }) => {
                setPending(false);
                setError(error.message)
            }
        }
        ) //either siggn in happens and we go to root route , or error occurs in which case we set our error 
    }

    //Generic method to signin using socials 
     const onSocials = async (provider : "google" | "github") => { 
        setError(null);
        setPending(true);

        authClient.signIn.social(
            {
                provider : provider,
                callbackURL : "/" 
            }, {
            onSuccess: () => {
                setPending(false);
                
            },
            onError: ({ error }) => {
                setPending(false);
                setError(error.message)
            }
        }
        ) 
    }

    return (

        <div className="flex flex-col gap-6 ">

            {/* This is the Complete card , it has 2 sections , 1 is for signin and other is logo*/}
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">

                    {/* This is the Part 1 of Card for actual Sign IN*/}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8 ">
                            <div className="flex flex-col gap-6">
                                {/* Below Div is for Welcome Back and another Message*/}
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold">
                                        Welcome Back
                                    </h1>
                                    <p className="text-muted-foreground text-balance">
                                        Login to your Account
                                    </p>
                                </div>
                                {/* Below Div is for Email Input*/}
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="m@example.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {/* Below Div is for Pass Input */}
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="********"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/*Below Div is For displaying Server Side error on Form */}

                                {!!error && (
                                    <Alert className="bg-destructive/10 border-none">
                                        <OctagonAlert className="h-1 w-4 !text-destructive" />
                                        <AlertTitle>{error}</AlertTitle>
                                    </Alert>
                                )}

                                {/* Below is Sign In Button */}

                                <Button
                                    disabled={pending}
                                    type="submit"
                                    className="w-full">
                                    Sign In
                                </Button>

                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    <span className="bg-card text-muted-foreground relative z-10 px-2 ">
                                        Or continue With
                                    </span>

                                </div>

                                {/* Below div is Socials login*/}


                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        onClick={() => onSocials("google")}
                                        disabled={pending}
                                        variant="outline"
                                        type="button"
                                        className="w-full"
                                    >
                                        <FaGoogle/>
                                    </Button>

                                    <Button
                                        disabled={pending}
                                         onClick={() => onSocials("github")}
                                        variant="outline"
                                        type="button"
                                        className="w-full"
                                    >
                                        <FaGithub/>
                                        
                                    </Button>
                                </div>
                                {/* Below div is for  going to signup page */}
                                <div className="text-center text-sm">
                                    Don&apos;t have an Account?{""}
                                    <Link href="/sign-up" className="underline underline-offset-4">
                                        SignUp
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>


                    {/*This is the part 2 of the card with the logo */}
                    <div className="bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col gap-y-4 items-center justify-center">
                        <img src="/logo.svg" alt="Image" className="h-[92px] w-[92px]" />
                        <p className="text-2xl font-semibold text-white">
                            Meet.AI
                        </p>
                    </div>

                </CardContent>

            </Card>

            {/* Small Text Outside the Card  */}
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue ,  agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </div>


        </div>

    )
}
