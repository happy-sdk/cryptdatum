// SPDX-License-Identifier: Apache-2.0
//
// Copyright © 2022 The Happy Authors

package main

import (
	"github.com/happy-sdk/happy"
	"github.com/happy-sdk/happy/sdk/logging"
)

func main() {
	app := happy.New(happy.Settings{
		Name: "Cryptdatum",
		Slug: "cryptdatum",
		// Identifier
		Description:    "The Cryptdatum format is a powerful, flexible universal data format for storing data to be long term compatible accross domains",
		CopyrightBy:    "The Happy authors",
		CopyrightSince: 2022,
		License:        "Apache-2.0 license",
		Logging: logging.Settings{
			Level:       logging.LevelOk,
			NoSource:    true,
			NoTimestamp: true,
		},
	})

	app.AddInfo("From personal projects to enterprise solutions, Cryptdatum is a universal data format designed for secure and efficient data storage and transmission across any application.")

	app.WithCommands(
		cmdCheck(),
		cmdCreate(),
		cmdInfo(),
	)
	app.Run()
}
