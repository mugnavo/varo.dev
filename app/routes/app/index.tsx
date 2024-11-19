import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "ai/react";
import { motion } from "motion/react";
import { Input } from "~/components/ui/input";

export const Route = createFileRoute("/app/")({
  component: AppIndex,
});

function AppIndex() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <div className="flex flex-col">
        {messages.map((m) => (
          <motion.div
            layout
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
            key={m.id}
            className={
              "w-fit whitespace-pre-wrap rounded-lg py-2" +
              (m.role === "user" ? " self-end bg-secondary px-3" : " self-start")
            }
          >
            {m.content}
          </motion.div>
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
