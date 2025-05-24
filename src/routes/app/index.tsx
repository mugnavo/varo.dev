import { useChat } from "@ai-sdk/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {} from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Fragment, Suspense, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import DevProfileCard from "~/components/chat/DevProfileCard";
import { Button } from "~/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { Textarea } from "~/components/ui/textarea";
import { suggestionsQueryOptions } from "~/lib/ai/functions/suggestions";
import { SearchDevelopersReturnType } from "~/lib/ai/tools";

export const Route = createFileRoute({
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(suggestionsQueryOptions());
    return { user: context.user };
  },
  component: AppIndex,
});

function AppIndex() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const { user } = Route.useLoaderData();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!messages.length || !messagesEndRef.current) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col">
      <div className="flex flex-1 flex-col pt-4 pb-6">
        {messages.map((m) => (
          <Fragment key={m.id}>
            <motion.div
              initial={{ opacity: 0, scale: 1, y: 10, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: "spring",
                  bounce: 0.3,
                  duration: 0.1,
                },
              }}
              style={{ originY: 0.1 }}
              className={
                "prose dark:prose-invert w-fit rounded-lg" +
                (m.role === "user"
                  ? " bg-secondary mt-6 self-end px-3.5 py-2"
                  : " mt-2 self-start py-2")
              }
            >
              <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize, remarkGfm]}>
                {m.content}
              </ReactMarkdown>
            </motion.div>
            {m.parts
              .filter((part) => part.type === "tool-invocation")
              ?.map(({ toolInvocation }) => {
                const { toolName, toolCallId, state } = toolInvocation;
                if (state === "result") {
                  if (toolName === "searchDevelopers") {
                    const result = toolInvocation.result as SearchDevelopersReturnType;

                    if (!result?.developers?.length) return null;

                    return (
                      <Carousel key={toolCallId} opts={{ align: "start" }}>
                        <CarouselContent>
                          {result.developers.map((dev, devIndex) => (
                            <CarouselItem
                              className="lg:basis-1/2 xl:basis-1/3"
                              key={dev.id}
                            >
                              <motion.div
                                initial={{ opacity: 0, scale: 1, y: 10, x: 0 }}
                                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                                exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                                transition={{
                                  opacity: { duration: 0.1 + devIndex * 0.25 },
                                  layout: {
                                    type: "spring",
                                    bounce: 0.3,
                                    duration: 0.1,
                                  },
                                }}
                                style={{ originY: 0.1 }}
                              >
                                <DevProfileCard dev={dev} />
                              </motion.div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel>
                    );
                  }
                }
              })}
          </Fragment>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 0 && (
        <>
          <Suspense>
            <CurrentSuggestions />
          </Suspense>
          <div className="flex flex-col items-center px-2 py-4">
            Welcome to Varo, {user.name || user.username}.
          </div>
        </>
      )}

      <form
        className={
          "bg-background sticky bottom-4 flex gap-2 rounded-md transition-[margin] " +
          (messages.length ? "mb-2" : "mb-[42vh]")
        }
        onSubmit={handleSubmit}
      >
        <Textarea
          className="bg-input min-h-8 resize-none"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
          rows={2}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <Button type="submit" className="h-full" size="lg">
          Send
        </Button>
      </form>
    </div>
  );
}

function CurrentSuggestions() {
  const { data } = useSuspenseQuery(suggestionsQueryOptions());
  const { user } = Route.useLoaderData();

  return data.users.length ? (
    <Carousel opts={{ align: "start" }}>
      <CarouselContent>
        {data.users.map((userMatch, devIndex) => (
          <CarouselItem
            className="lg:basis-1/2"
            key={`${userMatch.user1_id}_${userMatch.user2_id}`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 1, y: 10, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              transition={{
                opacity: { duration: 0.1 + devIndex * 0.25 },
                layout: {
                  type: "spring",
                  bounce: 0.3,
                  duration: 0.1,
                },
              }}
              style={{ originY: 0.1 }}
            >
              <DevProfileCard
                dev={user.id === userMatch.user1_id ? userMatch.user2 : userMatch.user1}
              />
            </motion.div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ) : null;
}
