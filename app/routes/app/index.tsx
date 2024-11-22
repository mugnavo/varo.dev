import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "ai/react";
import { motion } from "motion/react";
import { Fragment } from "react";
import DevProfileCard from "~/components/chat/DevProfileCard";
import { Input } from "~/components/ui/input";
import { SearchDevelopersReturnType } from "~/server/ai/tools";

export const Route = createFileRoute("/app/")({
  component: AppIndex,
});

function AppIndex() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="stretch mx-auto flex w-full max-w-lg flex-col py-24">
      <div className="flex flex-col">
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

      <form onSubmit={handleSubmit}>
        <Input
          className="fixed bottom-0 mb-8 w-full max-w-md"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
