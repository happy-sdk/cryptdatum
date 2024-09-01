package main

import (
	"errors"
	"fmt"
	"log/slog"
	"os"
	"path/filepath"
	"strings"

	"cryptdatum.dev/lib/go/cryptdatum"
	"github.com/happy-sdk/happy/pkg/vars/varflag"
	"github.com/happy-sdk/happy/sdk/action"
	"github.com/happy-sdk/happy/sdk/app/session"
	"github.com/happy-sdk/happy/sdk/cli/command"
)

func cmdCreate() *command.Command {
	cmd := command.New(command.Config{
		Name:        "create",
		Description: "Create cryptdatum container from provided path",
		MinArgs:     2,
		MinArgsErr:  "both <src> and <dest> path must be provided",
		MaxArgs:     2,
		MaxArgsErr:  "only <src> and <dest> path must be provided",
		Usage:       "<src> <destination directory>",
	})

	cmd.WithFlags(varflag.BoolFunc("force", false, "create destination directory if it does not exist or overwrite file if exists", "f"))
	cmd.Do(func(sess *session.Context, args action.Args) error {
		srcpath := args.Arg(0).String()
		destpath := args.Arg(1).String()

		srcstat, err := os.Stat(srcpath)
		if err != nil {
			return fmt.Errorf("src: %w", err)
		}
		if srcstat.IsDir() {
			return errors.New("src: is directory")
		}

		force := args.Flag("force").Var().Bool()

		deststat, err := os.Stat(destpath)
		if err != nil {
			if !errors.Is(err, os.ErrNotExist) {
				return fmt.Errorf("dest: %w", err)
			} else {
				if force {
					if err := os.MkdirAll(destpath, 0750); err != nil {
						return fmt.Errorf("dest: %w", err)
					}
				} else {
					return fmt.Errorf("dest: path does not exist and no --force flag set for %s", destpath)
				}
			}
		} else if !deststat.IsDir() {
			return errors.New("dest: is not a directory")
		}
		srcFilename := filepath.Base(srcpath)
		name := strings.TrimSuffix(srcFilename, filepath.Ext(srcFilename))

		dest := filepath.Join(destpath, fmt.Sprintf("%s.cdatum", name))

		// Create and write the container file
		sess.Log().Info("creating cryptdatum container",
			slog.String("src", srcpath),
			slog.String("dest", dest),
		)

		cdatum := cryptdatum.New(name)
		defer cdatum.Close()

		// Print result
		info, err := cdatum.Seal()
		if err != nil {
			return err
		}
		printInfo(info)

		return nil
	})
	return cmd
}
