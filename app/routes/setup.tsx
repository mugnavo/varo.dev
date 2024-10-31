import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { userProfileSchema } from "~/server/functions/profile";

export const Route = createFileRoute("/setup")({
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({
        to: "/",
      });
    } else if (context.user.setup_at) {
      throw redirect({
        to: "/app",
      });
    }

    return { user: context.user };
  },
  component: SetupPage,
});

function SetupPage() {
  const { user } = Route.useRouteContext();
  const form = useForm<z.infer<typeof userProfileSchema>>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: user.name || "",
      username: user.username || "",
      bio: "",
      location: "",

      match_project: true,
      match_user: true,

      experience_level: 2,
      availability: 2,

      interests: [],
      skills: [],
      tech_stack: [],
    },
  });

  function onSubmit(values: z.infer<typeof userProfileSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <span>Hi, {user.name || user.username}. Let's get you set up.</span>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Button type="submit">Submit</Button>
    </div>
  );
}
