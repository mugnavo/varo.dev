import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { setupProfile, userProfileSchema } from "~/lib/server/functions/profile";

import { Button } from "~/lib/components/ui/button";
import MultipleSelector, { Option } from "~/lib/components/ui/custom/multi-select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/lib/components/ui/form";
import { Input } from "~/lib/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/lib/components/ui/select";
import { Switch } from "~/lib/components/ui/switch";
import { Textarea } from "~/lib/components/ui/textarea";

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

  loader: ({ context }) => {
    return { user: context.user };
  },
  component: SetupPage,
});

const interestOptions: Option[] = [
  { label: "Web Development", value: "web development" },
  { label: "Mobile Development", value: "mobile development" },
  { label: "Game Development", value: "game development" },
  { label: "Artificial Intelligence", value: "artificial intelligence" },
  { label: "Cybersecurity", value: "cybersecurity" },
];

const techStackOptions: Option[] = [
  { label: "C#", value: "c#" },
  { label: "Java", value: "java" },
  { label: "Python", value: "python" },
  { label: "JavaScript/TypeScript", value: "javascript" },
  { label: "Ruby", value: "ruby" },
  { label: "PHP", value: "php" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
  { label: "Swift", value: "swift" },
];

function SetupPage() {
  const { user } = Route.useLoaderData();
  const { queryClient } = Route.useRouteContext();

  const form = useForm<z.infer<typeof userProfileSchema>>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: user.name || "",
      username: user.username || "",
      bio: "",
      location: "",

      match_project: true,
      match_user: true,

      experience_level: 0,
      availability: 0,

      interests: [],
      skills: [],
    },
  });

  const submitSetup = useServerFn(setupProfile);

  async function onSubmit(values: z.infer<typeof userProfileSchema>) {
    try {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      const result = await submitSetup({ data: values });

      if (result?.success === false) {
        console.log(result.message);
        toast.error(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 px-4 pb-8 pt-24 xl:pt-32">
      <span>Hi, {user.name || user.username}. Let's get you set up.</span>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid w-full gap-4 md:max-w-xl md:grid-cols-2"
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
              <FormItem className="row-span-3">
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
              <FormItem className="flex w-full items-center justify-between">
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
              <FormItem className="flex w-full items-center justify-between">
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
                  defaultValue={field.value ? field.value.toString() : undefined}
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
                  defaultValue={field.value ? field.value.toString() : undefined}
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
                  <MultipleSelector
                    {...field}
                    onChange={(option) => field.onChange(option.map((o) => o.value))}
                    value={
                      field.value?.map(
                        (value) =>
                          interestOptions.find((o) => o.value === value) || {
                            label: value,
                            value,
                          },
                      ) || []
                    }
                    hideClearAllButton
                    creatable
                    defaultOptions={interestOptions}
                    placeholder="Enter your interests"
                  />
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
                  <MultipleSelector
                    {...field}
                    onChange={(option) => field.onChange(option.map((o) => o.value))}
                    value={
                      field.value?.map(
                        (value) =>
                          techStackOptions.find((o) => o.value === value) || {
                            label: value,
                            value,
                          },
                      ) || []
                    }
                    hideClearAllButton
                    creatable
                    defaultOptions={techStackOptions}
                    placeholder="Enter your tech stack"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={form.formState.isSubmitting}
            className="mt-4 md:col-span-2"
            type="submit"
          >
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
