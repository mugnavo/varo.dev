import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "ai/react";
import { motion } from "motion/react";
import { Fragment } from "react";
import DevProfileCard from "~/components/chat/DevProfileCard";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { SearchDevelopersReturnType } from "~/server/ai/tools";

export const Route = createFileRoute("/app/")({
  component: AppIndex,
});

function AppIndex() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col">
      <div className="flex flex-1 flex-col pt-4">
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
                "w-fit whitespace-pre-wrap rounded-lg" +
                (m.role === "user"
                  ? " self-end bg-secondary px-3.5 py-2"
                  : " mt-2 self-start py-2")
              }
            >
              {m.content}
            </motion.div>
            {m.toolInvocations?.map((toolInvoc) => {
              const { toolName, toolCallId, state } = toolInvoc;
              if (state === "result") {
                if (toolName === "searchDevelopers") {
                  const result = toolInvoc.result as SearchDevelopersReturnType;

                  return (
                    <div key={toolCallId} className="grid grid-cols-4 gap-2">
                      {result.developers.map((dev, devIndex) => (
                        <motion.div
                          key={dev.user_id}
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
                      ))}
                    </div>
                  );
                }
              }
            })}
          </Fragment>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="flex flex-col items-center px-2 py-4">Welcome to Varo.</div>
      )}

      <form
        className={
          "sticky bottom-4 flex gap-2 transition-[margin] " +
          (messages.length ? "mb-2" : "mb-[42vh]")
        }
        onSubmit={handleSubmit}
      >
        <Textarea
          className="min-h-8 resize-none"
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
