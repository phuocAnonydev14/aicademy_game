import {Image} from "../ui/image";
import {Progress} from "@/components/ui/progress";

export const CourseItem = () => {
  return (
    <div className="max-w-[50dvw]">
      <div className="relative shadow-[rgba(219,225,254,255)_0px_1px_1px,rgba(9,30,66,0.13)_0px_0px_1px_1px]">
        <Image
          src="https://images.unsplash.com/photo-1742268351241-b1b2ccae70c5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
        />
        <Progress className="absolute left-1/2 bottom-[10px] -translate-x-1/2" value={33}/>
      </div>
      <div className="p-3">
      </div>
    </div>
  );
};
