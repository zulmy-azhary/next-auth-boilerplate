import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Social } from "@/components/auth/social";
import { Separator } from "@/components/ui/separator";

type CardWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  headerTitle: string;
  headerDescription: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
};

export const CardWrapper = (props: CardWrapperProps) => {
  const {
    headerTitle,
    headerDescription,
    backButtonLabel,
    backButtonHref,
    showSocial,
    children,
    ...rest
  } = props;

  return (
    <Card className="w-[400px] shadow mx-4 md:mx-0" {...rest}>
      <CardHeader className="text-center">
        <CardTitle>{headerTitle}</CardTitle>
        <CardDescription>{headerDescription}</CardDescription>
      </CardHeader>
      {children ? <CardContent>{children}</CardContent> : null}
      {showSocial ? (
        <>
          <CardFooter className="gap-x-2">
            <Separator className="shrink" />
            <p className="text-sm text-center basis-full">Or Connect With</p>
            <Separator className="shrink" />
          </CardFooter>
          <CardFooter>
            <Social />
          </CardFooter>
        </>
      ) : null}
      <Separator />
      <CardFooter className="py-3">
        <Button variant="link" className="font-normal w-full" size="sm" asChild>
          <Link href={backButtonHref}>{backButtonLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
