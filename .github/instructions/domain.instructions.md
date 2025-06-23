---
applyTo: "**/domain/**/*.ts"
---

# Project coding standards for domain layer code

## General Guidelines

- On the domain layer is where the business logic lives.
- The domain layer should not depend on any other layers.
- The domain layer should be independent of any frameworks or libraries.
- On the domain layer, we store aggregates roots, entities, value objects, domain events, domain errors, domain services, and repositories interfaces.
- The classes should be supported by the basis of the @/lib/ddd folder, which provides the necessary base classes and utilities for implementing Domain-Driven Design (DDD) concepts.
  - The `Aggregate` class provides the base functionality for aggregate roots.
  - The value-objects should extend the respective base value object class
  - The name constructors like `fromPrimitives` and `toPrimitives` are used to convert between the domain objects and their primitive representations. using the `Primitives` type from `@/lib/ddd/types`.

### Naming Conventions

- Use kebab-case for file names.
- Use PascalCase for class names.
- Use camelCase for method and variable names.
- Use nouns for class names.
- Use verbs for method names.
- Use singular nouns for entities and value objects.
- Use plural nouns for repositories.

### File Structure

- Each aggregate root should have its own directory.
- Each entity, value object, domain event, domain error, and domain service should be in its own file.
- The entities and repositories should be in the same directory as the aggregate root they belong to.
- Domain events should be in a separate directory within the aggregate root directory.
- Domain errors should be in a separate directory within the aggregate root directory.
- Domain services should be in a separate directory within the aggregate root directory.

### Comments and Documentation

- Use JSDoc comments for classes, methods, and properties.
- Document the purpose of the class, method, or property.
- Use comments to explain complex logic or decisions.
- Avoid unnecessary comments; the code should be self-explanatory.

### Aggregate Roots

- An aggregate root is the main entry point for an aggregate.
- It should encapsulate the business logic and enforce invariants.
- It should provide methods to interact with the aggregate.
- It should not expose its internal state directly; use methods to manipulate the state.

#### Example of an Aggregate Root

```typescript
export class Order {
  constructor(
    id: Uuid,
    private readonly items: OrderItem[],
    private readonly status: OrderStatus,
    createdAt: DateValueObject,
    updatedAt: DateValueObject,
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(
    id: string,
    items: { id: string; productId: string; quantity: number }[],
    status: string,
  ): Order {
    const orderItems = items.map((item) =>
      OrderItem.create(item.id, item.productId, item.quantity),
    );
    const orderStatus = OrderStatus.fromString(status);
    return new Order(
      Uuid.fromString(id),
      orderItems,
      orderStatus,
      DateValueObject.now(),
      DateValueObject.now(),
    );
  }

  static fromPrimitives(data: Primitives<Order>): Order {
    const items = data.items.map((item) => OrderItem.fromPrimitives(item));
    const status = OrderStatus.fromString(data.status);
    return new Order(
      Uuid.fromString(data.id),
      items,
      status,
      new DateValueObject(data.createdAt),
      new DateValueObject(data.updatedAt),
    );
  }

  toPrimitives(): Primitives<Order> {
    return {
      id: this.id.toString(),
      items: this.items.map((item) => item.toPrimitives()),
      status: this.status.toString(),
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }
}
```

### Entities

- An entity is a domain object that has a unique identity.
- It should encapsulate its own state and behavior.
- It should provide methods to manipulate its state.

#### Example of an Entity

```typescript
export class OrderItem {
  constructor(
    private readonly id: Uuid,
    private readonly productId: Uuid,
    private quantity: number,
  ) {}

  static create(id: string, productId: string, quantity: number): OrderItem {
    return new OrderItem(Uuid.fromString(id), Uuid.fromString(productId), quantity);
  }

  static fromPrimitives(data: Primitives<OrderItem>): OrderItem {
    return new OrderItem(Uuid.fromString(data.id), Uuid.fromString(data.productId), data.quantity);
  }

  toPrimitives(): Primitives<OrderItem> {
    return {
      id: this.id.toString(),
      productId: this.productId.toString(),
      quantity: this.quantity,
    };
  }
}
```

### Value Objects

- A value object is a domain object that represents a descriptive aspect of the domain.
- It should be immutable and should not have an identity.
- It should provide methods to manipulate its state, if necessary.
- It should support on corresponding class of the `@/lib/ddd/value-objects` folder, such as `StringValueObject`, `NumberValueObject`, or `Enum`.
- Each property on an entity or aggregate root should be a value object, if applicable.
- Each value object should be in its own file.
- Make the the value objects necessaries for the aggregate root and entities to the aggregate

#### Example of a Value Object

```typescript
export enum OrderStatusValue {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}
export class OrderStatus extends Enum {
  private constructor(value: OrderStatusValue) {
    super(value, Object.values(OrderStatusValue));
  }

  static pending(): OrderStatus {
    return new OrderStatus(OrderStatusValue.PENDING);
  }
  static completed(): OrderStatus {
    return new OrderStatus(OrderStatusValue.COMPLETED);
  }
  static cancelled(): OrderStatus {
    return new OrderStatus(OrderStatusValue.CANCELLED);
  }
}

export class OrderDescription extends StringValueObject {
  constructor(value: string) {
    super(value);
  }

  protected validation(value: string): void {
    if (value.length < 5 || value.length > 255) {
      throw new DomainError("Order description must be between 5 and 255 characters.");
    }
  }
}
```

### Domain Events

- A domain event is a representation of something that has happened in the domain.
- It should be immutable and should not have an identity.
- It should provide a way to convert to and from its primitive representation.

#### Example of a Domain Event

```typescript
export type OrderCreatedData = {
  orderId: string;
  items: number;
};
export class OrderCreated extends DomainEvent {
  static EVENT_NAME = "order/created";
  constructor(aggregateId: string, data: OrderCreatedData, occurred_on: Date) {
    super(OrderCreated.EVENT_NAME, occurred_on, aggregateId, data);
  }

  toPrimitives(): DomainEventPrimitives<OrderCreated> {
    return {
      eventName: this.eventName,
      occurredOn: this.occurredOn.toISOString(),
      aggregateId: this.aggregateId,
      data: this.data,
    };
  }

  fromPrimitives(data: DomainEventPrimitives<OrderCreated>): OrderCreated {
    return new OrderCreated(data.aggregateId, data.data, new Date(data.occurredOn));
  }
}
```

### Domain Errors

- A domain error is a representation of an error that can occur in the domain.
- It should provide a way to convert to and from its primitive representation.

#### Example of a Domain Error

```typescript
export class OrderNotFoundError extends DomainError {
  constructor(orderId: string) {
    super(`Order with ID ${orderId} not found.`);
  }
}
```

### Domain Services

- A domain service is a stateless service that encapsulates domain logic that does not naturally fit within an entity or value object.
- It should provide methods to perform operations related to the domain.
- Each domain service should be in its own file.
- Domain services should not depend on any other layers.
- Each domain service should attack one specific domain concept or operation.

#### Example of a Domain Service

```typescript
export class OrderCreator {
  constructor(private readonly orderRepository: OrderRepository) {}

  async createOrder(items: { id: string; productId: string; quantity: number }[]): Promise<Order> {
    const order = Order.create(Uuid.generate().toString(), items, "pending");
    await this.orderRepository.save(order);
    return order;
  }
}
```

### Repositories

- A repository is an interface that defines methods for accessing and manipulating aggregates.
- It should provide methods to save, find, and delete aggregates.
- Each repository should be in its own file.
- The search and list methods should receive an criteria object to filter the results.
- Use the Criteria class from `@/lib/ddd/core/criteria` to define the search criteria.
- Avoid to make methods for each retrive or filter use case, instead use a generic search method that receives a criteria object.

#### Example of a Repository Interface

```typescript
export interface OrderRepository {
  save(order: Order): Promise<void>;
  search(criteria: Criteria): Promise<Order[]>;
  find(criteria: Criteria): Promise<Order | null>;
  delete(orderId: string): Promise<void>;
}
```

### Other Services Ports

- Other services ports are interfaces that define methods for accessing and manipulating external services.
- They should provide methods to interact with external services, such as payment gateways, email services, etc.
- Each service port should be in its own file.

#### Example of a Service Port Interface

```typescript
export interface PaymentServicePort {
  processPayment(orderId: string, amount: number): Promise<void>;
  refundPayment(orderId: string, amount: number): Promise<void>;
}
```
