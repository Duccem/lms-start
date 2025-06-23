---
applyTo: "**/*.tsx"
---

# React Form Instructions

This file contains instructions for creating a React form component. The form should include the following features:

- The form should be a functional component.
- It should use react-hook-form for form handling.
- The form should include validation for required fields.
- It should display error messages for invalid fields.
- It should use zod for schema validation.
- The form should include a submit button.
- It should use Form component from `@/lib/ui/components/form` for styling.
- Each form field should be wrapped in a `FormField` component.
- Each form field should be implemented with the input for the case like `Input` for text or ImagePicker for images.

# Example

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/lib/ui/components/form";
import { Button } from "@/lib/ui/components/button";
import { Input } from "@/lib/ui/components/input";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

type FormData = z.infer<typeof schema>;

const MyForm = () => {
  const [image, setImage] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const { isSubmitting } = form.formState;

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField>
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...register("name")} />
            </FormControl>
            {errors.name && <span>{errors.name.message}</span>}
          </FormItem>
        </FormField>
        <FormField>
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...register("email")} />
            </FormControl>
            {errors.email && <span>{errors.email.message}</span>}
          </FormItem>
        </FormField>
        <ImagePicker placeholder="imagen" setFileAction={(file) => setImage(file)} />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
```

# React Table Instructions

This file contains instructions for creating a React table component. The table should include the following features:

- The table should be a functional component.
- It should use react-table for table handling.
- It should include sorting and pagination.
- It should use the `Table` component from `@/lib/ui/components/table` for styling.
- Each column should be defined with a header and accessor.
- The table should be responsive and support different screen sizes.
- It should include a loading state when data is being fetched.

# Example

```tsx
import React from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/lib/ui/components/table";
import { Button } from "@/lib/ui/components/button";
import { Spinner } from "@/lib/ui/components/spinner";
import { useQuery } from "react-query";
import { fetchData } from "@/lib/api";
```
