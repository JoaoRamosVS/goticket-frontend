import type { EventCategoryDTO } from "@/features/admin/admin-categories/types/category.types";
import type { NewEventFormState } from "@/features/organizer/organizer-new-event/types/newEvent.types";
import {
    Field,
    StepSelect,
    StepTextArea,
    StepTextInput,
} from "@/features/organizer/organizer-new-event/components/stepShared";

type StepDetailsProps = {
    form: NewEventFormState;
    categories: EventCategoryDTO[];
    categoriesLoading: boolean;
    onChange: <K extends keyof NewEventFormState>(
        field: K,
        value: NewEventFormState[K]
    ) => void;
};

export const StepDetails = ({
    form,
    categories,
    categoriesLoading,
    onChange,
}: StepDetailsProps) => {
    const hasCategories = categories.length > 0;

    return (
        <div className="grid grid-cols-1 gap-5">
            <Field label="Título" htmlFor="title" required>
                <StepTextInput
                    id="title"
                    value={form.title}
                    onChange={(e) => onChange("title", e.target.value)}
                    placeholder="Ex: Festival GoTicket 2026"
                />
            </Field>

            <Field
                label="Descrição"
                htmlFor="description"
                required
                hint="Detalhes, atrações e informações relevantes para o público."
            >
                <StepTextArea
                    id="description"
                    rows={5}
                    value={form.description}
                    onChange={(e) => onChange("description", e.target.value)}
                    placeholder="Conte tudo sobre o seu evento..."
                />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Categoria" htmlFor="categoryId" required>
                    <StepSelect
                        id="categoryId"
                        value={form.categoryId}
                        disabled={categoriesLoading || !hasCategories}
                        onChange={(e) =>
                            onChange(
                                "categoryId",
                                (e.target as HTMLSelectElement).value
                            )
                        }
                    >
                        {!hasCategories && (
                            <option value="" disabled>
                                {categoriesLoading
                                    ? "Carregando categorias..."
                                    : "Nenhuma categoria disponível"}
                            </option>
                        )}
                        {hasCategories && (
                            <>
                                <option value="" disabled>
                                    Selecione uma categoria
                                </option>
                                {categories.map((category) => (
                                    <option
                                        key={category.categoryId}
                                        value={category.categoryId}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </>
                        )}
                    </StepSelect>
                </Field>

                <Field
                    label="Restrição de idade"
                    htmlFor="ageRestriction"
                    required
                    hint="0 indica evento livre."
                >
                    <StepTextInput
                        id="ageRestriction"
                        type="number"
                        min={0}
                        max={120}
                        value={form.ageRestriction}
                        onChange={(e) =>
                            onChange("ageRestriction", e.target.value)
                        }
                    />
                </Field>
            </div>

            <Field
                label="Início das vendas"
                htmlFor="salesStartDate"
                hint="Opcional. Quando deixado em branco, as vendas abrem assim que o evento é aprovado."
            >
                <StepTextInput
                    id="salesStartDate"
                    type="datetime-local"
                    value={form.salesStartDate}
                    onChange={(e) =>
                        onChange("salesStartDate", e.target.value)
                    }
                />
            </Field>
        </div>
    );
};
