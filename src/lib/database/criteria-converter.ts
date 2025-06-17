import {
  and,
  AnyTable,
  asc,
  desc,
  eq,
  gt,
  gte,
  inArray,
  like,
  ne,
  notInArray,
  notLike,
  or,
} from "drizzle-orm";
import {
  Criteria,
  Direction,
  Filter,
  Filters,
  FilterType,
  Operator,
  Order,
  Pagination,
} from "../ddd/core/criteria";

interface TransformerFunction<T, K> {
  (value: T): K;
}
export class DrizzleCriteriaConverter {
  private filterTransformers: Map<Operator, TransformerFunction<Filter, any>> =
    new Map([]);
  private table: AnyTable<any>;

  constructor(table: AnyTable<any>) {
    this.table = table;
    this.filterTransformers = new Map<
      Operator,
      TransformerFunction<Filter, any>
    >([
      [Operator.EQUAL, this.equal],
      [Operator.NOT_EQUAL, this.notEqual],
      [Operator.GT, this.greaterThan],
      [Operator.LT, this.lessThan],
      [Operator.GTE, this.greaterThanOrEqual],
      [Operator.LTE, this.lessThanOrEqual],
      [Operator.CONTAINS, this.like],
      [Operator.NOT_CONTAINS, this.notLike],
      [Operator.IN, this.in],
      [Operator.NOT_IN, this.notIn],
    ]);
  }

  public criteria(criteria: Criteria) {
    const where = this.filter(criteria.getFilters());
    const orderBy = criteria.hasOrder()
      ? this.order(criteria.getOrder()!)
      : undefined;
    const pagination = criteria.hasPagination()
      ? this.pagination(criteria.getPagination()!)
      : undefined;
    return {
      where,
      orderBy,
      ...pagination,
    };
  }

  private filter(filters: Filters): any {
    const filter = filters.filters.map((filter: any) => {
      const transformer = this.filterTransformers.get(filter.operator);
      if (transformer) {
        return transformer(filter);
      }
      throw Error(`Unexpected operator value ${filter.operator}`);
    });
    if (filters.type === FilterType.AND) return and(...filter);
    if (filters.type === FilterType.OR) return or(...filter);
  }

  private order(order: Order) {
    if (order.order === Direction.DESC) {
      //@ts-ignore
      return desc(this.table[order.field]);
    } else {
      //@ts-ignore
      return asc(this.table[order.field]);
    }
  }

  private pagination(pagination: Pagination) {
    return {
      offset: pagination.offset || 0,
      limit: pagination.limit || 10,
    };
  }

  private equal(filter: Filter) {
    //@ts-ignore
    return eq(this.table[filter.field], filter.value);
  }

  private notEqual(filter: Filter) {
    //@ts-ignore
    return ne(this.table[filter.field], filter.value);
  }

  private greaterThan(filter: Filter) {
    //@ts-ignore
    return gt(this.table[filter.field], filter.value);
  }

  private greaterThanOrEqual(filter: Filter) {
    //@ts-ignore
    return gte(this.table[filter.field], filter.value);
  }

  private lessThan(filter: Filter) {
    //@ts-ignore
    return lt(this.table[filter.field], filter.value);
  }

  private lessThanOrEqual(filter: Filter) {
    //@ts-ignore
    return lte(this.table[filter.field], filter.value);
  }

  private like(filter: Filter) {
    // @ts-ignore
    return like(this.table[filter.field], filter.value);
  }

  private notLike(filter: Filter) {
    // @ts-ignore
    return notLike(this.table[filter.field], filter.value);
  }

  private in(filter: Filter) {
    // @ts-ignore
    return inArray(this.table[filter.field], filter.value);
  }

  private notIn(filter: Filter) {
    // @ts-ignore
    return notInArray(this.table[filter.field], filter.value);
  }
}

