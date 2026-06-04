import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { nanoid } from "nanoid";
import { createRoom, joinRoom } from "@/firebase/battleService";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { toast } from "sonner";

const Home = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!user) {
      toast.error("You are not Logged in Yet", {
        position: "top-right",
        action: { label: "Log In", onClick: () => navigate("/auth") },
      });
      return;
    }
    const roomExist = await joinRoom(data.roomCode.toUpperCase(), user);
    if (roomExist) {
      navigate(`/lobby/${data.roomCode.toUpperCase()}`);
    } else {
      toast.error("No room exist for this code", { position: "top-right" });
    }
  };

  const handleCreateRoom = async () => {
    if (!user) {
      toast.error("You are not Logged in Yet", {
        position: "top-right",
        action: { label: "Log In", onClick: () => navigate("/auth") },
      });
      return;
    }
    const roomId = nanoid(4).toUpperCase();
    await createRoom(roomId, user);
    navigate(`/lobby/${roomId}`);
  };


  return (
    <>
      <div className="flex-1 flex flex-row  ">
        <div className="w-2/3 m-8 mr-0">
          <Card className="min-h-full">
            <CardHeader>
              <CardTitle>CodeClash</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="w-1/3 m-8 ">
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-3xl">
                Enter the Arena
              </CardTitle>
            </CardHeader>
            <CardContent className="m-3">
              <Button
                className="w-full h-12 text-xl font-semibold"
                onClick={handleCreateRoom}
              >
                {" "}
                <Search></Search> Create a room
              </Button>
              <div className="flex items-center gap-2 my-3">
                <hr className="flex-1 border-border" />
                <div className="text-[15px]">OR</div>
                <hr className="flex-1 border-border" />
              </div>

              <div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-row gap-3 items-center"
                >
                  <Input
                    placeholder="Enter a Room Code"
                    className="h-12"
                    {...register("roomCode", {
                      required: "Room code is required",
                      minLength: {
                        value: 4,
                        message: "Code is of 4 characters",
                      },
                      maxLength: {
                        value: 4,
                        message: "Code is of 4 characters",
                      },
                    })}
                  />
                  <Button type="submit" className="h-12  font-semibold">
                    Join Room
                  </Button>
                </form>
                {errors.roomCode && (
                  <p className="text-red-400 text-sm">
                    {errors.roomCode.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Home;
