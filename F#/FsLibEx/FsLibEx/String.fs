module String

open System

let replace (pattern: string * string) (res_str: string): string =
    let (old_str, new_str) = pattern
    res_str.Replace (old_str, new_str)

let split (token) (res_str: string) =
    res_str.Split (token)

let join (token) (list: string[]): string =
    String.Join (token, list)

let indexof (token: string) (res_str: string): int =
    res_str.IndexOf (token)

let trim (res_str: string): string = 
    res_str.Trim()

let tostring (value): string =
    value.ToString()

let tolower (res_str: string): string = 
    res_str.ToLower()

let toupper (res_str: string): string = 
    res_str.ToUpper()

let substr (args: int * int) (res_str: string): string =
    let (index, len) = args
    if len = 0 
        then
            res_str.Substring (index)
        else
            res_str.Substring (index, len)

