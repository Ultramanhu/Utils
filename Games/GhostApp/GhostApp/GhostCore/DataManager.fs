namespace GhostCore

open System
open System.Collections.Generic
open System.IO
open System.Runtime.Serialization
open System.Runtime.Serialization.Json

[<DataContract>]
type internal WordItem = 
    struct
        [<DataMember>]
        val mutable words: string array;
    end

[<DataContract>]
type internal WordList = 
    struct
        [<DataMember>]
        val mutable words: WordItem array;
    end

type Identity =
    | Judgement = 0
    | Majority = 1
    | Minority = 2
    | Ghost = 3

type Player =
    member public this.identity: Identity = Identity.Judgement
    member public this.word: string = ""

type WordsManager = 
    val mutable words: (string * string * string) array
    val mutable current: (string * string * string)
    member public this.init (stream: Stream) = 
        let serialized = (new DataContractJsonSerializer(typeof<WordList>)).ReadObject(stream)
        if not (serialized :? WordList) then failwith "json parse error"
        let list = serialized :?> WordList
        this.words <- Array.map (fun(word: WordItem) -> 
        (
            Array.get word.words 0, 
            Array.get word.words 1, 
            Array.get word.words 2
        )) list.words
        ()
    member public this.random =
        if this.words.Length = 0 then failwith "no available words"
        this.current <- Array.get this.words ((new System.Random()).Next(0, this.words.Length))
        ()