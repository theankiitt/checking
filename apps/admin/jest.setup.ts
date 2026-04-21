import "@testing-library/jest-dom";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  redirect: jest.fn(),
}));

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: {
        id: "1",
        name: "Test User",
        email: "test@example.com",
      },
    },
    status: "authenticated",
  }),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    promise: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
    custom: jest.fn(),
  },
  Toaster: () => null,
}));

// Mock @tanstack/react-query
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: () => ({
    invalidateQueries: jest.fn(),
    setQueryData: jest.fn(),
    getQueryData: jest.fn(),
    cancelQueries: jest.fn(),
  }),
  QueryClient: jest.fn().mockImplementation(() => ({
    setDefaultOptions: jest.fn(),
    clear: jest.fn(),
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}));

// Global fetch mock
global.fetch = jest.fn();

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
(globalThis as any).IntersectionObserver = class IntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
};

// Mock ResizeObserver
(globalThis as any).ResizeObserver = class ResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
};
