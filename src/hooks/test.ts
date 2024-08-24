import { api } from "~/trpc/react";

function test<TResponse extends { data: unknown }>(fn: () => TResponse) {
  return fn();
}

const fn = () => api.user.list.useQuery(void 0, {});

const a = test(fn);

if (a) {
  a.data?.[0]?.email;
}
