---
applyTo: "**/application/**/*.ts"
---

# Project coding standards for application layer code

## General Guidelines

- The application layer is responsible for orchestrating the use cases of the application.
- It should not contain any business logic; that belongs in the domain layer.
- The application layer should depend on the domain layer and the infrastructure layer.
- The application layer should contain use cases, commands, queries, and DTOs (Data Transfer Objects).
- Use dependency injection to manage dependencies.

## Naming Conventions

- Use kebab-case for file names.
- Use PascalCase for class names.
- Use camelCase for method and variable names.
- Use nouns for class names.
- Use verbs for method names.
- Use singular nouns for use cases
- The use case file and class should only have the name of the use case, e.g., `create-order.ts` for the `CreateOrder` class.

## File Structure

- Each use case should have its own file.
- Each dto should be in the use case file that uses it.

## Use case Example

```typescript
type OrderItemDto = {
  productId: string;
  quantity: number;
};
type CreateOrderCommand = {
  id: string;
  items: OrderItemDto[];
  status: OrderStatus;
};
export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateOrderCommand): Promise<OrderDto> {
    const order = Order.create(command.id, command.items, command.status);

    await this.orderRepository.save(order);
    this.eventBus.publish(new OrderCreatedEvent(order));

    return order.toPrimitives();
  }
}
```
