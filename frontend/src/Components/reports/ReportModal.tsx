import { useState } from "react";

import { Modal } from "../ui/Modal";
import { GlassSelect } from "../ui/GlassSelect";

interface ReportModalProps {
  open: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (
    reason: string,
    details: string
  ) => void;
}

const REASONS = [
  { value: "false_information", label: "False information" },
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment" },
  { value: "copyright", label: "Copyright" },
  { value: "other", label: "Other" },
];

export function ReportModal({
  open,
  isSubmitting = false,
  onClose,
  onSubmit,
}: ReportModalProps) {
  const [reason, setReason] = useState(REASONS[0].value);
  const [details, setDetails] = useState("");

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    onSubmit(reason, details);

    setDetails("");
  }

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Report Article"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label className="block mb-1 text-sm font-medium">
            Reason
          </label>

          <GlassSelect
            value={reason}
            onChange={setReason}
            options={REASONS}
            aria-label="Reason"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            Details
          </label>

          <textarea
            rows={4}
            value={details}
            onChange={(e) =>
              setDetails(e.target.value)
            }
            placeholder="Describe the issue..."
            className="w-full rounded-lg border border-slate-300 p-3"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-danger px-4 py-2 text-white disabled:opacity-60"
          >
            {isSubmitting
              ? "Submitting..."
              : "Submit Report"}
          </button>
        </div>
      </form>
    </Modal>
  );
}