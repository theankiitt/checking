# @repo/ui - Shared UI Component Library

A comprehensive, reusable React component library for the Gharsamma e-commerce monorepo. Built with TypeScript and Tailwind CSS.

## Features

- 🎨 **Base Components**: Button, Card
- 📝 **Form Components**: Input, Select, Checkbox, Textarea
- 🎯 **Layout Components**: Modal, Alert
- ✨ **Feedback Components**: Badge, Skeleton, Spinner, Alert
- 🧭 **Navigation Components**: Tabs, Pagination, Breadcrumb
- ⚓ **Hooks**: useDebounce, useToggle

## Installation

Components are automatically available through the monorepo. Import from `@repo/ui`:

```tsx
import { Button, Input, Card, Badge } from "@repo/ui";
```

## Components

### Base Components

#### Button

```tsx
import { Button } from "@repo/ui";

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

<Button variant="danger" isLoading={true}>
  Loading...
</Button>

<Button variant="outline" leftIcon={<Icon />}>
  With Icon
</Button>
```

**Props:**

- `variant`: "primary" | "secondary" | "outline" | "ghost" | "danger"
- `size`: "sm" | "md" | "lg"
- `isLoading`: boolean
- `leftIcon`, `rightIcon`: ReactNode
- Plus all standard button HTML attributes

#### Card

```tsx
import { Card, CardHeader, CardContent, CardFooter } from "@repo/ui";

<Card variant="bordered" padding="md" hoverable>
  <CardHeader>
    <h3>Title</h3>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>;
```

### Form Components

#### Input

```tsx
import { Input } from "@repo/ui";

<Input
  label="Email"
  type="email"
  placeholder="Enter email"
  error={errors.email?.message}
  helperText="We'll never share your email"
  leftIcon={<MailIcon />}
/>;
```

#### Select

```tsx
import { Select } from "@repo/ui";

<Select
  label="Country"
  options={[
    { label: "Nepal", value: "nepal" },
    { label: "USA", value: "usa" },
  ]}
  value={selectedCountry}
  onChange={setSelectedCountry}
  error={errors.country?.message}
/>;
```

#### Checkbox

```tsx
import { Checkbox } from "@repo/ui";

<Checkbox
  label="I agree to terms"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
  error={errors.terms?.message}
/>;
```

#### Textarea

```tsx
import { Textarea } from "@repo/ui";

<Textarea
  label="Message"
  placeholder="Enter your message"
  rows={4}
  error={errors.message?.message}
/>;
```

### Layout Components

#### Modal

```tsx
import { Modal } from "@repo/ui";

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Action"
  description="Are you sure you want to proceed?"
  size="md"
>
  <div className="flex gap-2 justify-end">
    <Button variant="outline" onClick={handleClose}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleConfirm}>
      Confirm
    </Button>
  </div>
</Modal>;
```

### Feedback Components

#### Badge

```tsx
import { Badge } from "@repo/ui";

<Badge variant="success" size="md">
  Active
</Badge>

<Badge variant="error" dot>
  3 notifications
</Badge>
```

#### Skeleton

```tsx
import { Skeleton, SkeletonCard } from "@repo/ui";

<Skeleton variant="rectangular" height={200} />
<Skeleton variant="circular" width={40} height={40} />

<SkeletonCard lines={5} />
```

#### Spinner

```tsx
import { Spinner, LoadingOverlay } from "@repo/ui";

<Spinner size="lg" color="primary" />

<LoadingOverlay text="Processing..." />
```

#### Alert

```tsx
import { Alert } from "@repo/ui";

<Alert variant="success" title="Success!">
  Your changes have been saved.
</Alert>

<Alert variant="error" title="Error">
  Something went wrong. Please try again.
</Alert>
```

### Navigation Components

#### Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui";

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>

  <TabsContent value="overview">Overview content here</TabsContent>
  <TabsContent value="details">Details content here</TabsContent>
  <TabsContent value="settings">Settings content here</TabsContent>
</Tabs>;
```

#### Pagination

```tsx
import { Pagination } from "@repo/ui";

<Pagination currentPage={1} totalPages={10} onPageChange={setPage} />;
```

#### Breadcrumb

```tsx
import { Breadcrumb } from "@repo/ui";

<Breadcrumb
  items={[
    { label: "Products", href: "/products" },
    { label: "Electronics", href: "/products/electronics" },
    { label: "Smartphones" },
  ]}
  onNavigate={(href) => router.push(href)}
/>;
```

### Hooks

#### useDebounce

```tsx
import { useDebounce } from "@repo/ui";

const [searchTerm, setSearchTerm] = useState("");
const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 300 });

useEffect(() => {
  // API call with debounced value
  fetchResults(debouncedSearchTerm);
}, [debouncedSearchTerm]);
```

#### useToggle

```tsx
import { useToggle } from "@repo/ui";

const { value: isModalOpen, toggle: toggleModal, setTrue: openModal, setFalse: closeModal } = useToggle();

<Button onClick={toggleModal}>Open Modal</Button>
<Modal isOpen={isModalOpen} onClose={closeModal}>...</Modal>
```

## Best Practices

### 1. Composition

Compose components for specific use cases:

```tsx
// Good: Specific component for the use case
<Button variant="primary" size="lg">Submit</Button>

// Avoid: Overly generic
<div className="bg-blue-500 px-4 py-2">Submit</div>
```

### 2. Type Safety

Always use TypeScript and the exported types:

```tsx
import { Button, ButtonProps } from "@repo/ui";

const CustomButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} variant="primary" />;
};
```

### 3. Dark Mode

All components support dark mode automatically via Tailwind's `dark:` classes:

```tsx
// Components automatically handle dark mode
<Card className="dark:bg-gray-900">Content works in both modes</Card>
```

### 4. Accessibility

Components are built with accessibility in mind:

```tsx
// Proper ARIA labels and keyboard navigation
<Button aria-label="Close modal" onClick={onClose}>
  <X />
</Button>
```

## Adding New Components

1. Create component in appropriate folder (base, form, layout, feedback, navigation)
2. Export component and its types
3. Add to folder's `index.ts`
4. Add to main `src/index.ts`
5. Document in this README
6. Add tests if applicable

## Structure

```
packages/ui/src/
├── base/           # Core components (Button, Card)
├── form/           # Form inputs (Input, Select, Checkbox, Textarea)
├── layout/         # Layout components (Modal)
├── feedback/       # Feedback components (Badge, Skeleton, Spinner, Alert)
├── navigation/     # Navigation components (Tabs, Pagination, Breadcrumb)
├── hooks/          # Custom hooks (useDebounce, useToggle)
└── index.ts        # Main exports
```

## License

Internal - Gharsamma E-commerce
