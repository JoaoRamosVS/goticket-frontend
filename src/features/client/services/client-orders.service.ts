import goTicketApi from "@/services/api";
import type { MyOrderListDTO } from "../types/my-order.types";

async function listMyOrders(
  page: number,
  pageSize: number,
  signal?: AbortSignal
): Promise<MyOrderListDTO> {
  const { data } = await goTicketApi.get<MyOrderListDTO>("/orders", {
    params: { page, pageSize },
    signal,
  });
  return data;
}

export default { listMyOrders };
