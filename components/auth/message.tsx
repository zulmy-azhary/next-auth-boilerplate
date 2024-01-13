import { cn } from "@/lib/utils";
import { RxExclamationTriangle } from "react-icons/rx";

type MessageProps = {
  type?: "success" | "error";
  message?: string;
};

export const Message = ({ type, message }: MessageProps) => {
  if (!message || !type) return null;

  return (
    <div
      className={cn(
        "p-3 rounded-md flex items-center gap-x-2 text-sm",
        type === "success" && "bg-green-500/15 text-green-500",
        type === "error" && "bg-destructive/15 text-destructive",
      )}
    >
      <RxExclamationTriangle className="text-xl" />
      <p>{message}</p>
    </div>
  );
}
