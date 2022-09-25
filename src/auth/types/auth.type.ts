import { BooleanFlags, OptionsFlags } from "src/common/types";
import { JwtSign } from "../interface/auth.interface";

export type JwtSignOpt = BooleanFlags<OptionsFlags<JwtSign>>;