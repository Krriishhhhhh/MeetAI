"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function Home() {

  const { data: session } = authClient.useSession()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSubmit = () => {
    authClient.signUp.email({
      email,
      name,
      password
    }, {

      onSuccess: (ctx) => {
        window.alert("Success")

      },
      onError: () => {
        window.alert("Something Went Wrong")
      },
    })
  }

  const onLogin = () => {
    authClient.signIn.email({
      email,
      password
    }, {

      onSuccess: (ctx) => {
        window.alert("Success")

      },
      onError: () => {
        window.alert("Something Went Wrong")
      },
    })
  }

  if(session){
    return(
      <div>
        <p>
          Logged in as {session.user.name}
          <Button onClick={()=> authClient.signOut()}>
            Sign Out
          </Button>
        </p>
      </div>
    )
  }

  return (
    <div>
      <Input placeholder="name" value={name} onChange={(e) => { setName(e.target.value) }} />
      <Input placeholder="email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
      <Input placeholder="password" type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />

      <Button onClick={onSubmit}>
        Create User
      </Button>

      <Input placeholder="email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
      <Input placeholder="password" type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />

      <Button onClick={onLogin}>
        Log In
      </Button>

    </div>

  );
}
