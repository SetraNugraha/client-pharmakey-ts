import { IsPaid } from "../../../types/transaction.type";
import { useTransaction } from "../../CustomHooks/useTransaction";
import { TableTransactions } from "./TableTransactions";
import { useState } from "react";

export default function AdminTransactions() {
  const [filter, setFilter] = useState<{ status?: IsPaid; proofUpload?: boolean }>({
    status: undefined,
    proofUpload: undefined,
  });

  const { transactions, isLoading, pagination, goToPrevPage, goToNextPage } = useTransaction({
    limit: 7,
    status: filter.status,
    proofUpload: filter.proofUpload,
  });

  return (
    <section className="px-10 py-5">
      <div>
        <div className="flex items-center justify-between mb-5">
          <h1 className="font-bold text-2xl">Transactions</h1>
          {/* Filter */}
          <div className="mr-3 flex items-center gap-x-5">
            {/* PROOF STATUS */}
            <div className="flex flex-col gap-y-1">
              <label htmlFor="proofStatus" className="uppercase font-bold text-slate-600">
                Proof Status
              </label>
              <select
                name="proofStatus"
                id="proofStatus"
                className="font-semibold text-slate-600 ring-2 ring-slate-600 h-[35px] w-[180px] px-2 rounded-lg"
                onChange={(e) => {
                  const value = e.target.value;

                  setFilter((prev) => ({
                    ...prev,
                    proofUpload: value === "" ? undefined : value === "true" ? true : false,
                  }));
                }}
              >
                <option value="">All Proof</option>
                <option value={"true"} className="font-semibold text-slate-600">
                  Uploaded
                </option>
                <option value={"false"} className="font-semibold text-slate-600">
                  Awaiting
                </option>
              </select>
            </div>

            {/* STATUS */}
            <div className="flex flex-col gap-y-1">
              <label htmlFor="status" className="uppercase font-bold text-slate-600">
                Status
              </label>
              <select
                name="status"
                id="status"
                className="font-semibold text-slate-600 ring-2 ring-slate-600 h-[35px] w-[180px] px-2 rounded-lg"
                onChange={(e) => setFilter((prev) => ({ ...prev, status: e.target.value as IsPaid }))}
              >
                <option value="">All Status</option>
                <option value={IsPaid.PENDING} className="font-semibold text-slate-600">
                  {IsPaid.PENDING}
                </option>
                <option value={IsPaid.SUCCESS} className="font-semibold text-slate-600">
                  {IsPaid.SUCCESS}
                </option>
                <option value={IsPaid.CANCELLED} className="font-semibold text-slate-600">
                  {IsPaid.CANCELLED}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <TableTransactions transactions={transactions} isLoading={isLoading} pagination={pagination} />
        </div>

        {/* Pagination */}
        <div className="absolute bottom-24  flex items-center gap-x-3 mt-5 ml-3">
          <button
            disabled={!pagination?.isPrev}
            onClick={goToPrevPage}
            className="px-2 py-1 bg-blue-500 font-semibold text-white rounded-lg cursor-pointer hover:outline-none hover:ring-2 hover:ring-blue-500 hover:text-blue-500 hover:bg-white duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed disabled:text-white disabled:ring-0"
          >
            Prev
          </button>
          <p className="px-3 py-1 ring-2 ring-slate-300 rounded-lg font-semibold text-slate-400">{pagination?.page}</p>
          <button
            disabled={!pagination?.isNext}
            onClick={goToNextPage}
            className="px-2 py-1 bg-blue-500 font-semibold text-white rounded-lg cursor-pointer hover:outline-none hover:ring-2 hover:ring-blue-500 hover:text-blue-500 hover:bg-white duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed disabled:text-white disabled:ring-0"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
