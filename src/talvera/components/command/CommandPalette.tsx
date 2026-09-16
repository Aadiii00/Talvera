import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { employees } from "@/talvera/data/employees";
import { skills } from "@/talvera/data/skills";
import { policyDocuments } from "@/talvera/data/policies";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [, setQuery] = useState("");

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  const go = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search workforce, skills, policies..." onValueChange={setQuery} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Employees">
          {employees.map((employee) => (
            <CommandItem key={employee.id} onSelect={() => go(`/talvera/employees/${employee.id}`)}>
              {employee.name} — {employee.role}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Skills">
          {skills.map((skill) => (
            <CommandItem key={skill.name} onSelect={() => go("/talvera/skill-intelligence")}>
              {skill.name} — {skill.scarcity} scarcity
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Policies">
          {policyDocuments.map((doc) => (
            <CommandItem key={doc.id} onSelect={() => go("/talvera/policy-intelligence")}>
              {doc.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
