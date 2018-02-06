package main

import (
	"encoding/json"
	"fmt"
	"os"
)

type testStruct struct {
	A int32 `json:"a"`
	B int32 `json:"b"`
	C int32 `json:"c"`
}

func main() {
	fmt.Println("{ \"test\": 100 }")
	fmt.Println("{")
	fmt.Println("  \"a\": 52")
	fmt.Println("}")

	x := testStruct{A: 1, B: 2, C: 3}
	bytes, err := json.Marshal(x)
	if err != nil {
		panic(err)
	}

	os.Stdout.Write(bytes)
}
