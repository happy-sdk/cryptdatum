package main

import (
	"cryptdatum.dev/lib/go/cryptdatum"
	"github.com/davecgh/go-spew/spew"
	"github.com/happy-sdk/happy/sdk/action"
	"github.com/happy-sdk/happy/sdk/app/session"
	"github.com/happy-sdk/happy/sdk/cli/command"
)

func cmdInfo() *command.Command {
	cmd := command.New(command.Config{
		Name:        "info",
		Description: "Display cryptdatum information for provided path",
		MinArgs:     1,
		MinArgsErr:  "no input path provided",
		MaxArgs:     1,
		MaxArgsErr:  "only one source path must be provided",
	})

	cmd.Do(func(sess *session.Context, args action.Args) error {

		cdatum, err := cryptdatum.Open(args.Arg(0).String())
		if err != nil {
			return err
		}
		defer cdatum.Close()

		info, err := cdatum.Info()
		if err != nil {
			return err
		}
		printInfo(info)
		return nil
	})
	return cmd
}

func printInfo(info cryptdatum.Info) {
	spew.Dump(info)
}
