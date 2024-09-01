package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"slices"
	"sync"

	"cryptdatum.dev/lib/go/cryptdatum"
	"github.com/happy-sdk/happy/pkg/strings/textfmt"
	"github.com/happy-sdk/happy/pkg/vars/varflag"
	"github.com/happy-sdk/happy/sdk/action"
	"github.com/happy-sdk/happy/sdk/app/session"
	"github.com/happy-sdk/happy/sdk/cli/command"
)

const (
	fileMsgValid = "valid"
)

func cmdCheck() *command.Command {
	cmd := command.New(command.Config{
		Name:        "check",
		Description: "Check that provided path is valid cryptdatum container",
		MinArgs:     1,
		MinArgsErr:  "no input path provided",
		MaxArgs:     255,
		MaxArgsErr:  "maximum inputs reached",
	})
	cmd.WithFlags(varflag.BoolFunc("json", false, "outputs check result as json array"))
	cmd.Do(func(sess *session.Context, args action.Args) error {

		c := &checker{
			json: args.Flag("json").Var().Bool(),
		}
		for _, src := range args.Args() {
			c.Add(src.String())
		}

		return c.Result()
	})
	return cmd
}

type checkerStatus struct {
	Path   string `json:"path"`
	Valid  bool   `json:"valid"`
	Status string `json:"status"`
}

type checker struct {
	mu     sync.Mutex
	wg     sync.WaitGroup
	json   bool
	checks []checkerStatus
}

func (fc *checker) Add(src string) {
	fc.mu.Lock()

	if slices.ContainsFunc(fc.checks, func(c checkerStatus) bool {
		return c.Path == src && c.Valid
	}) {
		fc.mu.Unlock()
		return
	}

	fc.wg.Add(1)
	fc.checks = append(fc.checks, checkerStatus{Path: src})
	fc.mu.Unlock()

	go func(src string) {
		defer fc.wg.Done()
		cdatum, err := cryptdatum.Open(src)
		fc.SetResult(src, err)
		if err == nil {
			cdatum.Close()
		}
	}(src)
}

func (fc *checker) Result() error {
	fc.wg.Wait()
	fc.mu.Lock()
	defer fc.mu.Unlock()

	if fc.json {
		checkb, err := json.Marshal(fc.checks)
		if err != nil {
			return err
		}
		fmt.Println(string(checkb))
		return nil
	}
	result := textfmt.Table{
		Title:      "Cryptdatum filepath Checks",
		WithHeader: true,
	}
	result.AddRow("PATH", "VALID", "STATUS")

	for _, check := range fc.checks {
		result.AddRow(check.Path, fmt.Sprint(check.Valid), check.Status)
	}
	fmt.Println(result.String())
	return nil
}

// SetResult sets the result of the check based on the provided error.
func (fc *checker) SetResult(src string, err error) {
	fc.mu.Lock()
	defer fc.mu.Unlock()

	// Find the index of the element with the matching Path
	index := slices.IndexFunc(fc.checks, func(c checkerStatus) bool {
		return c.Path == src
	})

	if index != -1 {
		// Update the existing check
		fc.checks[index].Valid = err == nil
		if err != nil {
			switch {
			case errors.Is(err, cryptdatum.ErrDatumInvalid):
				fc.checks[index].Status = "DATUM INVALID flag bit set"
			case errors.Is(err, cryptdatum.ErrDatumDraft):
				fc.checks[index].Status = "draft"
			case errors.Is(err, cryptdatum.ErrDatumCompromised):
				fc.checks[index].Status = "compromised"
			default:
				fc.checks[index].Status = err.Error()
			}
		} else {
			fc.checks[index].Status = fileMsgValid
		}
	}
}
