"use client";
import { cn } from "@/lib/utils";
import { Comment as CommentType } from "@prisma/client";
import { useState } from "react";
import { Separator } from "../ui/separator";
import { Comment } from "./Comment";

export interface CommentNode extends CommentType {
  children: CommentNode[];
}

const placeholder: CommentType[] = [
  {
    id: 1,
    content: "This is an amazing feature!",
    likes: 10,
    dislikes: 2,
    userId: "user_123",
    tickerId: 1,
    parentId: null,
    createdAt: new Date("2025-02-25T12:00:00Z"),
    updatedAt: new Date("2025-02-25T14:30:00Z"),
  },
  {
    id: 2,
    content: "I completely agree with you!",
    likes: 5,
    dislikes: 1,
    userId: "user_456",
    tickerId: 1,
    parentId: 1,
    createdAt: new Date("2025-02-25T12:30:00Z"),
    updatedAt: new Date("2025-02-25T14:35:00Z"),
  },
  {
    id: 3,
    content: "Not sure about this, could be better.",
    likes: 2,
    dislikes: 5,
    userId: "user_789",
    tickerId: 1,
    parentId: 2,
    createdAt: new Date("2025-02-25T08:15:00Z"),
    updatedAt: new Date("2025-02-25T09:45:00Z"),
  },
  {
    id: 4,
    content: "Can you explain further?",
    likes: 3,
    dislikes: 0,
    userId: "user_101",
    tickerId: 1,
    parentId: 1,
    createdAt: new Date("2025-02-25T13:10:00Z"),
    updatedAt: new Date("2025-02-25T13:20:00Z"),
  },
  {
    id: 5,
    content: "Interesting take! I hadn't thought about it like that.",
    likes: 8,
    dislikes: 1,
    userId: "user_202",
    tickerId: 1,
    parentId: null,
    createdAt: new Date("2025-02-25T09:00:00Z"),
    updatedAt: new Date("2025-02-25T10:30:00Z"),
  },
];

export default function Comments({
  disableScroll = false,
}: {
  disableScroll?: boolean;
}) {
  const commentTree = buildCommentTree(placeholder);
  console.log(commentTree, "CHECK");

  return (
    <div
      className={cn(
        !disableScroll && "overflow-y-auto",
        "max-h-[300px] w-full"
      )}
    >
      {commentTree.map((node) => (
        <CommentItem key={node.id} node={node} />
      ))}
    </div>
  );
}

function buildCommentTree(comments: CommentType[]): CommentNode[] {
  const map = new Map<number, CommentNode>();
  const roots: CommentNode[] = [];

  comments.forEach((comment) =>
    map.set(comment.id, { ...comment, children: [] })
  );

  map.forEach((node) => {
    if (node.parentId) {
      const parent = map.get(node.parentId);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
}

interface CommentItemProps {
  node: CommentNode;
  depth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ node, depth = 1 }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const hasChildren = node.children.length > 0;

  return (
    <div className="mb-2">
      <Comment
        data={node}
        hasChildren={hasChildren}
        depth={depth}
        expanded={expanded}
        setExpanded={setExpanded}
        length={node.children.length}
      />

      {expanded && hasChildren && depth < 2 && (
        <div className="ml-12 mt-2">
          {node.children.map((child) => (
            <CommentItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
      {node.parentId === null && <Separator />}
    </div>
  );
};
