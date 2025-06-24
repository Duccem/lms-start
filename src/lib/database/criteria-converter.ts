import {
  Criteria,
  Filter,
  Filters,
  FilterType,
  Include,
  isFilter,
  Operator,
  Order,
  Pagination,
} from "@/lib/ddd/core/criteria";
interface TransformerFunction<T, K> {
  (value: T): K;
}
export class PrismaCriteriaConverter {
  private filterTransformers: Map<Operator, TransformerFunction<Filter, any>> = new Map([]);
  constructor() {
    this.filterTransformers = new Map<Operator, TransformerFunction<Filter, any>>([
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
    const orderBy = criteria.hasOrder() ? this.order(criteria.getOrder()!) : undefined;
    const pagination = criteria.hasPagination()
      ? this.pagination(criteria.getPagination()!)
      : undefined;
    const include = this.include(criteria.getIncludes());
    return {
      where,
      orderBy,
      ...pagination,
      include,
    };
  }

  private filter(filters: Filters): any {
    const filter = filters.filters.map((filter: any) => {
      if (!isFilter(filter)) return this.filter(filter);
      const transformer = this.filterTransformers.get(filter.operator);
      if (transformer) {
        return transformer(filter);
      }
      throw Error(`Unexpected operator value ${filter.operator}`);
    });
    if (filters.type === FilterType.AND) return { AND: [...filter] };
    if (filters.type === FilterType.OR) return { OR: [...filter] };
    if (filters.type === FilterType.NOT) return { NOT: [...filter] };
  }

  private order(order: Order) {
    return {
      [order.field]: order.order.toLowerCase(),
    };
  }

  private pagination(pagination: Pagination) {
    return {
      skip: pagination.offset || 0,
      take: pagination.limit || 10,
    };
  }
  private include(include: Include[]): { [key: string]: any } {
    return include.reduce((acc, include) => {
      return {
        ...acc,
        [include.field]: include.criteria ? this.criteria(include.criteria) : true,
      };
    }, {});
  }

  private equal(filter: Filter) {
    return {
      [filter.field]: filter.value,
    };
  }

  private notEqual(filter: Filter) {
    return {
      [filter.field]: {
        not: filter.value,
      },
    };
  }

  private greaterThan(filter: Filter) {
    return {
      [filter.field]: {
        gt: filter.value,
      },
    };
  }

  private greaterThanOrEqual(filter: Filter) {
    return {
      [filter.field]: {
        gte: filter.value,
      },
    };
  }

  private lessThan(filter: Filter) {
    return {
      [filter.field]: {
        lt: filter.value,
      },
    };
  }

  private lessThanOrEqual(filter: Filter) {
    return {
      [filter.field]: {
        lte: filter.value,
      },
    };
  }

  private like(filter: Filter) {
    return {
      [filter.field]: {
        contains: filter.value,
      },
    };
  }

  private notLike(filter: Filter) {
    return {
      [filter.field]: {
        not: {
          contains: filter.value,
        },
      },
    };
  }

  private in(filter: Filter) {
    return {
      [filter.field]: {
        in: filter.value,
      },
    };
  }

  private notIn(filter: Filter) {
    return {
      [filter.field]: {
        notIn: filter.value,
      },
    };
  }
}
