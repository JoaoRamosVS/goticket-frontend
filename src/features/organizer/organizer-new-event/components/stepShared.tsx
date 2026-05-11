import type {
    InputHTMLAttributes,
    ReactNode,
    SelectHTMLAttributes,
    TextareaHTMLAttributes,
} from "react";

export const stepInputClass =
    "w-full rounded-2xl border border-white/70 bg-white/60 shadow-xs px-4 py-2.5 text-sm text-[#00334d] placeholder:text-[#5e6c87]/60 backdrop-blur-xl outline-none transition-all duration-300 focus:border-[#2a8fd4]/50 focus:bg-white/90 focus:shadow-[0_0_0_4px_rgba(42,143,212,0.12)]";

type FieldProps = {
    label: string;
    htmlFor: string;
    required?: boolean;
    hint?: string;
    children: ReactNode;
};

export const Field = ({ label, htmlFor, required, hint, children }: FieldProps) => (
    <div className="flex flex-col gap-1.5">
        <label
            htmlFor={htmlFor}
            className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5e6c87]"
        >
            {label}
            {required && <span className="ml-1 text-[#2a8fd4]">*</span>}
        </label>
        {children}
        {hint && <p className="text-[11px] text-[#5e6c87]/80">{hint}</p>}
    </div>
);

export const StepTextInput = (props: InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className={`${stepInputClass} h-11 ${props.className ?? ""}`} />
);

export const StepTextArea = (
    props: TextareaHTMLAttributes<HTMLTextAreaElement>
) => (
    <textarea
        {...props}
        className={`${stepInputClass} resize-y ${props.className ?? ""}`}
    />
);

type StepSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
    children: ReactNode;
};

export const StepSelect = ({ children, className, ...rest }: StepSelectProps) => (
    <select
        {...rest}
        className={`h-11 w-full cursor-pointer rounded-2xl border border-white/70 bg-white/60 px-4 text-sm text-[#00334d] backdrop-blur-xl shadow-xs outline-none transition-all duration-300 focus:border-[#2a8fd4]/50 focus:bg-white/90 focus:shadow-[0_0_0_4px_rgba(42,143,212,0.12)] disabled:cursor-not-allowed disabled:opacity-60 ${className ?? ""}`}
    >
        {children}
    </select>
);
