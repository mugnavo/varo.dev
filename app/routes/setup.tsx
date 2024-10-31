import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { userProfileSchema } from "~/server/functions/profile";

import { Button } from "~/components/ui/button";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "~/components/ui/custom/multi-select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";

export const Route = createFileRoute("/setup")({
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({
        to: "/signin",
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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 md:grid-cols-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Juan Tamad" {...field} />
                </FormControl>
                <FormMessage />
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
                  <Input placeholder="juantamad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="I'm a software engineer who loves to code."
                    rows={6}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Cebu, Philippines" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="match_user"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Match me with users</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="match_project"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Match me with projects</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Level</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value, 10))}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Beginner</SelectItem>
                    <SelectItem value="2">Experienced</SelectItem>
                    <SelectItem value="3">Expert</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Availability</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value, 10))}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Volunteer</SelectItem>
                    <SelectItem value="2">Part-time</SelectItem>
                    <SelectItem value="3">Full-time</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interests</FormLabel>
                <FormControl>
                  <MultiSelector
                    onValuesChange={field.onChange}
                    values={field.value || []}
                  >
                    <MultiSelectorTrigger>
                      <MultiSelectorInput placeholder="Enter your interests" />
                    </MultiSelectorTrigger>
                    <MultiSelectorContent>
                      <MultiSelectorList allowCustom>
                        <MultiSelectorItem value="Web Development">
                          Web Development
                        </MultiSelectorItem>
                        <MultiSelectorItem value="Mobile Development">
                          Mobile Development
                        </MultiSelectorItem>
                        <MultiSelectorItem value="Game Development">
                          Game Development
                        </MultiSelectorItem>
                        <MultiSelectorItem value="Artificial Intelligence">
                          Artificial Intelligence
                        </MultiSelectorItem>
                        <MultiSelectorItem value="Cybersecurity">
                          Cybersecurity
                        </MultiSelectorItem>
                      </MultiSelectorList>
                    </MultiSelectorContent>
                  </MultiSelector>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* TODO dont use "tech stack" term for non-devs */}
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tech stack</FormLabel>
                <FormControl>
                  <MultiSelector
                    onValuesChange={field.onChange}
                    values={field.value || []}
                  >
                    <MultiSelectorTrigger>
                      <MultiSelectorInput placeholder="Enter your tech stack" />
                    </MultiSelectorTrigger>
                    <MultiSelectorContent>
                      <MultiSelectorList allowCustom>
                        <MultiSelectorItem value="C#">C#</MultiSelectorItem>
                        <MultiSelectorItem value="Java">Java</MultiSelectorItem>
                        <MultiSelectorItem value="Python">Python</MultiSelectorItem>
                        <MultiSelectorItem value="JavaScript/TypeScript">
                          JavaScript/TypeScript
                        </MultiSelectorItem>
                        <MultiSelectorItem value="Ruby">Ruby</MultiSelectorItem>
                        <MultiSelectorItem value="PHP">PHP</MultiSelectorItem>
                        <MultiSelectorItem value="Go">Go</MultiSelectorItem>
                        <MultiSelectorItem value="Rust">Rust</MultiSelectorItem>
                        <MultiSelectorItem value="Swift">Swift</MultiSelectorItem>
                      </MultiSelectorList>
                    </MultiSelectorContent>
                  </MultiSelector>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="md:col-span-2" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
