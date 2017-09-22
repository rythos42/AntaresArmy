﻿using System.Linq;

namespace ParseAntaresPdf.Text
{
    public static class Models
    {
        /* 
         * This is a list of all models that come out of the parsed PDF. 
         * Each line in the parsed output has all spaces removed (because there are some spacing issues), and then the line is checked to see if it contains
         * one of these strings. If it does, then a new <model> tag is created. 

         * If this list is not complete, bad things will happen.
        */
        private static readonly string[] Names =
        {
            "C3 STRIKE COMMAND SQUAD",
            "NUHU MANDARIN",
            "C3 DROP COMMAND SQUAD",
            "CONCORD DRONE COMMANDER",
            "NANO-PROBE NET",
            "C3 STRIKE SQUAD",
            "C3 DROP SQUAD",
            "C3 INTERCEPTOR COMMAND SQUAD",
            "C3 INTERCEPTOR SQUAD",
            "C3 STRIKE SUPPORT TEAM",
            "CONCORD C3D1 LIGHT SUPPORT DRONE",
            "CONCORD T7 TRANSPORTER DRONE",
            "CONCORD C3D2 MEDIUM SUPPORT DRONE",
            "C3 STRIKE HEAVY SUPPORT TEAM",
            "CONCORD C3M4 COMBAT DRONE",
            "CONCORD C3M407 (CS) CLOSE SUPPORT DRONE",
            "CONCORD C3M25 HEAVY COMBAT DRONE",
            "CONCORD C3M50 HEAVY SUPPORT DRONE",
            "TARGETER PROBE SHARD",
            "MEDI-PROBE SHARD",
            "SCOUT PROBE SHARD",
            "CONCORD ISO-DRONE",
            "CONCORD C3D1/GP GENERAL PURPOSE DRONE",

            "FREEBORN COMMAND SQUAD",
            "FREEBORN NUHU RENEGADE",
            "VARDANARI SQUAD (BODYGUARD)",
            "DOMARI SQUAD (HOUSEHOLD TROOPS)",
            "FERAL SQUAD (MHAGRIS)",
            "SKYRAIDER COMMAND SQAUD",
            "SKYRAIDER SQUAD",
            "MHAGRIS SKARK SQUAD",
            "FREEBORN SUPPORT TEAM",
            "T7 TYPE GENERAL PURPOSE TRANSPORTER DRONE",
            "FREEBORN STRIKER ATTACK SKIMMER",
            "FREEBORN HEAVY SUPPORT TEAM",
            "FREEBORN SPECIALIST HEAVY SUPPORT TEAM",
            "M4 TYPE COMBAT DRONE",
            "MHAGRIS MELD SKARK",
            "M407 CS TYPE CLOSE SUPPORT DRONE",
            "SOLAR COMMAND SKIMMER",
            "M25 TYPE HEAVY COMBAT DRONE",
            "M50 TYPE HEAVY SUPPORT DRONE",
            "TARGETER PROBE SHARD",
            "ISO-DRONE",
            "HOUND PROBE SHARD",
            "LIGHT GENERAL PURPOSE DRONE",
            "MISGENIC REJECTS",
        };
        
        public static string GetAdjustedName(string contains)
        {
            var containsNoSpaces = contains.Replace(" ", "");
            return Names.FirstOrDefault(name => name.Replace(" ", "").Equals(containsNoSpaces));
        }
    }
}
