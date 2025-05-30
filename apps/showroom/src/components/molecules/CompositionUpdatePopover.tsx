import { useRef, useState } from "react";

import { useAppContext } from "../../AppContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";

const CompositionUpdatePopover: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { id, setId, isDefaultId } = useAppContext();

  const initialStateRef = useRef({ id });

  const [isOpen, setIsOpen] = useState(false);

  const [formId, setFormId] = useState(!isDefaultId ? id : "");

  const onReset = () => {
    const { id } = initialStateRef.current;

    setFormId(id);

    setId(id);
    setIsOpen(false);
  };

  // FUTURE: make more robust by checking if form values are valid
  const canSubmit = formId === id;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setId(formId);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80">
        <form className="grid gap-4" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="id">ID</Label>
              <Input
                id="id"
                className="col-span-2 h-8"
                placeholder="Enter the vehicle ID"
                value={formId}
                onChange={e => setFormId(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button type="button" variant="outline" onClick={onReset}>
              Reset
            </Button>
            <Button disabled={canSubmit}>Apply</Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default CompositionUpdatePopover;
