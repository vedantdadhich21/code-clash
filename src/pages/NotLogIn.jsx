import { IconFolderCode } from "@tabler/icons-react"
import { ArrowUpRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptyDemo() {
  return (
   <Empty className='h-[60vh] p-5'>
  <EmptyHeader >
    <EmptyMedia variant="icon" className="size-12 [&_svg]:size-12">
      <IconFolderCode />
    </EmptyMedia>
    <EmptyTitle className="text-4xl">No Account Yet</EmptyTitle>
    <EmptyDescription className="text-lg max-w-sm">
      You haven&apos;t created any account yet. Get started by creating
      your account or logging in.
    </EmptyDescription>
  </EmptyHeader>
  <EmptyContent className="flex-row justify-center gap-3 mt-4">
    <Button size="lg">Log In</Button>
    <Button size="lg" variant="outline">Sign Up</Button>
  </EmptyContent>
</Empty>
  )
}
