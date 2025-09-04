import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Brain,
  MessageSquare,
  GitBranch,
  Wrench,
  Code,
  FileText,
  Search,
  Star,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useUIStore } from '@/stores/uiStore';
import { NodeType } from '@/types';

interface NodeTemplate {
  type: NodeType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  category: string;
}

const nodeTemplates: NodeTemplate[] = [
  {
    type: 'aiagent',
    label: 'AI Agent',
    icon: Bot,
    description: 'Multi-purpose AI agent with configurable capabilities',
    category: 'AI',
  },
  {
    type: 'llm',
    label: 'LLM',
    icon: Brain,
    description: 'Large Language Model integration (OpenAI, Gemini, Claude)',
    category: 'AI',
  },
  {
    type: 'prompt',
    label: 'Prompt',
    icon: MessageSquare,
    description: 'Template management for system and user prompts',
    category: 'AI',
  },
  {
    type: 'condition',
    label: 'Condition',
    icon: GitBranch,
    description: 'Conditional branching with true/false outputs',
    category: 'Logic',
  },
  {
    type: 'tool',
    label: 'Tool',
    icon: Wrench,
    description: 'External tool integration and API calls',
    category: 'Integration',
  },
  {
    type: 'code',
    label: 'Code',
    icon: Code,
    description: 'Custom Python code execution blocks',
    category: 'Logic',
  },
  {
    type: 'document',
    label: 'Document',
    icon: FileText,
    description: 'Document processing and file handling',
    category: 'Data',
  },
  {
    type: 'retriever',
    label: 'Retriever',
    icon: Search,
    description: 'Vector database and semantic search operations',
    category: 'Data',
  },
  {
    type: 'custom',
    label: 'Custom Agent',
    icon: Star,
    description: 'User-created reusable agent components',
    category: 'Custom',
  },
];

const categories = ['AI', 'Logic', 'Integration', 'Data', 'Custom'];

interface SidebarProps {
  onNodeDragStart?: (nodeType: NodeType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNodeDragStart }) => {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const handleNodeDragStart = (nodeType: NodeType) => {
    if (onNodeDragStart) {
      onNodeDragStart(nodeType);
    }
  };

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-80 border-r bg-background shadow-lg md:relative md:top-0 md:h-full"
        >
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-semibold">Node Palette</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="md:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {categories.map((category) => (
                  <div key={category}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {nodeTemplates
                        .filter((template) => template.category === category)
                        .map((template) => (
                          <div
                            key={template.type}
                            className="group relative cursor-grab active:cursor-grabbing"
                            draggable
                            onDragStart={() => handleNodeDragStart(template.type)}
                          >
                            <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-colors">
                              <div className="mt-0.5">
                                <template.icon className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium">
                                  {template.label}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {template.description}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="border-t p-4">
              <div className="text-xs text-muted-foreground text-center">
                Drag nodes to the canvas to start building
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};