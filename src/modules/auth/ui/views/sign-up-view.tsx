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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

//Schema of how Form inputs should be 
const formSchema = z.object({
    name: z.string().min(1, { message: "Name is Required " }),
    email: z.string().email(),
    password: z.string().min(1, { message: "Password is Required" }),
    confirmPassword: z.string().min(1, { message: "Password is Required" })
})
    .refine((data) => data.password === data.confirmPassword,
        {
            message: "Passwords don't match",
            path: ["confirmPassword"]
        }
    )


export const SignUpView = () => {

    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    //Initialising the form using form schema and useform
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
    });

    {/*Below is the function which is responsible for truly logging in the user  */ }
    const onSubmit = async (data: z.infer<typeof formSchema>) => { //data provided to onsubmit is of type formSchema which has already been declared using zod , thus data would be email  and a pass of min 1 length , This we know for sure
        setError(null);
        setPending(true);

        authClient.signUp.email(
            {
                name: data.name,
                email: data.email,
                password: data.password
            }, {
            onSuccess: () => {
                setPending(false);
                router.push("/")
            },
            onError: ({ error }) => {
                setPending(false);
                setError(error.message)
            }
        }
        ) //either siggn in happens and we go to root route , or error occurs in which case we set our error 
    }

    return (

        <div className="flex flex-col gap-6 ">
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8 ">
                            <div className="flex flex-col gap-6">

                                {/* Below Div is for Top section Greetings*/}
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold">
                                        Let&apos;s get Started
                                    </h1>
                                    <p className="text-muted-foreground text-balance">
                                        Create Your Account
                                    </p>
                                </div>

                                {/* Below Div is for Name Input*/}
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Krish Garg"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
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

                                {/* Below Div is for ConfirmPassWord Input*/}
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password </FormLabel>
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

                                {/* Below is Sign Up Button */}

                                <Button
                                    disabled={pending}
                                    type="submit"
                                    className="w-full">
                                    Sign Up
                                </Button>

                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    <span className="bg-card text-muted-foreground relative z-10 px-2 ">
                                        Or continue With
                                    </span>

                                </div>

                                {/* Below div is Socials login*/}


                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        disabled={pending}
                                        variant="outline"
                                        type="button"
                                        className="w-full"
                                    >
                                        Google
                                    </Button>

                                    <Button
                                        disabled={pending}
                                        variant="outline"
                                        type="button"
                                        className="w-full"
                                    >
                                        GitHub
                                    </Button>
                                </div>


                                {/* Below div is for  going to sigin page */}
                                <div className="text-center text-sm">
                                    Already have an Account?{""}
                                    <Link href="/sign-in" className="underline underline-offset-4">
                                        SignIn
                                    </Link>
                                </div>


                            </div>
                        </form>
                    </Form>


                    {/* Below div is Meet AI logo */}
                    <div className="bg-radial from-green-700 to-green-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
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
