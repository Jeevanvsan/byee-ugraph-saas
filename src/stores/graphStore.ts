import { create } from 'zustand';
import { Graph, GraphData, GraphNode, GraphEdge } from '@/types';

interface GraphStore {
  currentGraph: Graph | null;
  graphs: Graph[];
  isLoading: boolean;
  error: string | null;
  
  // Graph operations
  setCurrentGraph: (graph: Graph | null) => void;
  updateGraphData: (graphData: GraphData) => void;
  saveGraph: (graph: Partial<Graph>) => Promise<void>;
  loadGraphs: () => Promise<void>;
  deleteGraph: (graphId: string) => Promise<void>;
  
  // Node operations
  addNode: (node: GraphNode) => void;
  updateNode: (nodeId: string, updates: Partial<GraphNode>) => void;
  removeNode: (nodeId: string) => void;
  
  // Edge operations
  addEdge: (edge: GraphEdge) => void;
  updateEdge: (edgeId: string, updates: Partial<GraphEdge>) => void;
  removeEdge: (edgeId: string) => void;
  
  // Utility
  clearError: () => void;
  resetStore: () => void;
}

export const useGraphStore = create<GraphStore>((set, get) => ({
  currentGraph: null,
  graphs: [],
  isLoading: false,
  error: null,

  setCurrentGraph: (graph) => {
    set({ currentGraph: graph, error: null });
  },

  updateGraphData: (graphData) => {
    const { currentGraph } = get();
    if (currentGraph) {
      set({
        currentGraph: {
          ...currentGraph,
          graphData,
          updatedAt: new Date(),
        },
      });
    }
  },

  saveGraph: async (graph) => {
    set({ isLoading: true, error: null });
    try {
      // API call to save graph
      const response = await fetch('/api/graphs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ugraph_token')}`,
        },
        body: JSON.stringify(graph),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save graph');
      }
      
      const savedGraph = await response.json();
      set((state) => ({
        graphs: [...state.graphs, savedGraph],
        currentGraph: savedGraph,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
    }
  },

  loadGraphs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/graphs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('ugraph_token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to load graphs');
      }
      
      const data = await response.json();
      set({ graphs: data.graphs, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
    }
  },

  deleteGraph: async (graphId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/graphs/${graphId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('ugraph_token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete graph');
      }
      
      set((state) => ({
        graphs: state.graphs.filter((g) => g.id !== graphId),
        currentGraph: state.currentGraph?.id === graphId ? null : state.currentGraph,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
    }
  },

  addNode: (node) => {
    const { currentGraph } = get();
    if (currentGraph) {
      const updatedGraphData = {
        ...currentGraph.graphData,
        nodes: [...currentGraph.graphData.nodes, node],
      };
      get().updateGraphData(updatedGraphData);
    }
  },

  updateNode: (nodeId, updates) => {
    const { currentGraph } = get();
    if (currentGraph) {
      const updatedGraphData = {
        ...currentGraph.graphData,
        nodes: currentGraph.graphData.nodes.map((node) =>
          node.id === nodeId ? { ...node, ...updates } : node
        ),
      };
      get().updateGraphData(updatedGraphData);
    }
  },

  removeNode: (nodeId) => {
    const { currentGraph } = get();
    if (currentGraph) {
      const updatedGraphData = {
        ...currentGraph.graphData,
        nodes: currentGraph.graphData.nodes.filter((node) => node.id !== nodeId),
        edges: currentGraph.graphData.edges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId
        ),
      };
      get().updateGraphData(updatedGraphData);
    }
  },

  addEdge: (edge) => {
    const { currentGraph } = get();
    if (currentGraph) {
      const updatedGraphData = {
        ...currentGraph.graphData,
        edges: [...currentGraph.graphData.edges, edge],
      };
      get().updateGraphData(updatedGraphData);
    }
  },

  updateEdge: (edgeId, updates) => {
    const { currentGraph } = get();
    if (currentGraph) {
      const updatedGraphData = {
        ...currentGraph.graphData,
        edges: currentGraph.graphData.edges.map((edge) =>
          edge.id === edgeId ? { ...edge, ...updates } : edge
        ),
      };
      get().updateGraphData(updatedGraphData);
    }
  },

  removeEdge: (edgeId) => {
    const { currentGraph } = get();
    if (currentGraph) {
      const updatedGraphData = {
        ...currentGraph.graphData,
        edges: currentGraph.graphData.edges.filter((edge) => edge.id !== edgeId),
      };
      get().updateGraphData(updatedGraphData);
    }
  },

  clearError: () => {
    set({ error: null });
  },

  resetStore: () => {
    set({
      currentGraph: null,
      graphs: [],
      isLoading: false,
      error: null,
    });
  },
}));