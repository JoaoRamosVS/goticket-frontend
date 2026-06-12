import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Crown, ImagePlus, X } from "lucide-react";

type StepImagesProps = {
    images: File[];
    onAdd: (files: File[]) => void;
    onRemove: (index: number) => void;
    onMove: (from: number, to: number) => void;
};

export const StepImages = ({ images, onAdd, onRemove, onMove }: StepImagesProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    useEffect(() => {
        const urls = images.map((f) => URL.createObjectURL(f));
        setPreviewUrls(urls);
        return () => urls.forEach((u) => URL.revokeObjectURL(u));
    }, [images]);

    const handleFiles = useCallback(
        (files: FileList | null) => {
            if (!files) return;
            const imageFiles = Array.from(files).filter((f) =>
                f.type.startsWith("image/")
            );
            if (imageFiles.length > 0) onAdd(imageFiles);
        },
        [onAdd]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragOver(false);
            handleFiles(e.dataTransfer.files);
        },
        [handleFiles]
    );

    return (
        <div className="flex flex-col gap-5">
            <p className="text-sm text-[#5e6c87]">
                Opcional — a primeira imagem será usada como capa do evento.
            </p>

            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`flex h-36 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed transition-all duration-200 backdrop-blur-xl ${
                    isDragOver
                        ? "border-[#2a8fd4] bg-[#2a8fd4]/10"
                        : "border-white/60 bg-white/25 hover:border-[#2a8fd4]/50 hover:bg-white/40"
                }`}
                style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.8)" }}
            >
                <ImagePlus className="size-8 text-[#2a8fd4]/70" strokeWidth={1.5} />
                <span className="text-sm font-semibold text-[#5e6c87]">
                    Clique ou arraste imagens aqui
                </span>
            </button>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
            />

            {images.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {images.map((file, index) => (
                        <div
                            key={`${file.name}-${file.lastModified}-${index}`}
                            className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/30 backdrop-blur-xl"
                            style={{
                                boxShadow:
                                    "0 6px 20px -10px rgba(0,46,71,0.2), inset 0 1px 0 0 rgba(255,255,255,0.85)",
                            }}
                        >
                            {previewUrls[index] && (
                                <img
                                    src={previewUrls[index]}
                                    alt={file.name}
                                    className="aspect-square w-full object-cover"
                                />
                            )}

                            {index === 0 && (
                                <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-xl bg-amber-400/90 px-2 py-0.5 text-[10px] font-bold text-amber-900 backdrop-blur-sm">
                                    <Crown className="size-2.5" strokeWidth={2.5} />
                                    Capa
                                </span>
                            )}

                            <div className="absolute bottom-1.5 left-1.5 flex size-5 items-center justify-center rounded-lg bg-white/80 text-[10px] font-bold text-[#5e6c87] backdrop-blur-sm">
                                {index + 1}
                            </div>

                            <div className="absolute bottom-1.5 right-1.5 flex gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => onMove(index, index - 1)}
                                        title="Mover para esquerda"
                                        className="flex size-6 items-center justify-center rounded-lg bg-white/90 text-[#00334d] shadow-sm transition-all hover:scale-110"
                                    >
                                        <ArrowLeft className="size-3" strokeWidth={3} />
                                    </button>
                                )}
                                {index < images.length - 1 && (
                                    <button
                                        type="button"
                                        onClick={() => onMove(index, index + 1)}
                                        title="Mover para direita"
                                        className="flex size-6 items-center justify-center rounded-lg bg-white/90 text-[#00334d] shadow-sm transition-all hover:scale-110"
                                    >
                                        <ArrowRight className="size-3" strokeWidth={3} />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => onRemove(index)}
                                    title="Remover"
                                    className="flex size-6 items-center justify-center rounded-lg bg-red-500/90 text-white shadow-sm transition-all hover:scale-110"
                                >
                                    <X className="size-3" strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
